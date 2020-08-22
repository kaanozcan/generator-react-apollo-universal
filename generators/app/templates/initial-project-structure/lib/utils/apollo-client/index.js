import { ApolloClient, gql, addTypename, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { InMemoryCache } from "@apollo/client/cache";
import fetch from "isomorphic-fetch";
import { Agent } from "https";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
//import { SchemaLink } from '@apollo/client/link/schema';

const nodeEnv = {
  isTest: process.env.NODE_ENV === "test",
  isDevevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production"
}

const getBaseUrl = (baseUrl) => {
  if (process.env.browser) {
    const { protocol, hostname, port } = window.location;

    return `${protocol}//${hostname}${port ? ":" + port : ""}`;
  }

  return baseUrl;
}

const getLink = (baseDomain, graphqlSubscriptionUrl, isWSEnabled, clientStateCache, req) => {
  let httpFetchOptions = {
    batchInterval: 25,
    credentials: "include"
  };

  const baseUrl = getBaseUrl(baseDomain);

  let httpLinkOptions = {
    uri: baseUrl + "/api/graphql",
    fetchOptions: httpFetchOptions,
    fetch: fetch
  };

  if (!process.env.browser) {
    httpLinkOptions.headers = {
      Origin: baseUrl,
      cookie: req.headers.cookie
    };
  }

  const httpLink = new BatchHttpLink(httpLinkOptions);

  const errorLink = onError(({ operation, forward}) => {
    //forward(operation)
  });

  const link = errorLink.concat(httpLink);

  if (process.env.browser && isWSEnabled) {
    const { hostname, port } = window.location;

      const wsLink = new WebSocketLink({
        uri: `ws://${hostname}${port ? ":" + port : ""}/subscriptions`,
        options: {
          reconnect: true,
          timeout: 5000
        }
      });

      return split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);

          return kind === "OperationDefinition" && operation === "subscription";
        },
        wsLink,
        link
      );
    }

  return link;
};

const getMemoryCache = (initialData) => {
  const memoryCache = new InMemoryCache();

  if (initialData) {
    memoryCache.restore(initialData);
  }

  return memoryCache;
};

export default ({
  context,
  baseUrl,
  initialData,
  graphqlSubscriptionUrl,
  isWSEnabled = false,
  ssrMode = false,
  resolvers,
  clientState,
  req
}) => {
  const cache = getMemoryCache(initialData);

  const link = getLink(baseUrl, graphqlSubscriptionUrl, isWSEnabled, cache, req);

  // https://github.com/apollographql/apollo-link/issues/1009
  // if (!process.env.browser) {
  //   const schema = require("src/graphql").default;
  //
  //   link = new SchemaLink({
  //     schema: schema.schema,
  //   });
  // } else {
  //   link = getLink(baseUrl, graphqlSubscriptionUrl, isWSEnabled, cache, req);
  // };

  const apolloClient = new ApolloClient({
    ssrMode,
    link,
    cache,
    resolvers
  });

  if (clientState) {
    cache.writeQuery({
      query: gql`
        query {
          clientState @client {
            bundleManifest {
              bundle
              vendor
            }
          }
        }
      `,
      data: {
        clientState
      }
    });
  }

  return apolloClient;
};
