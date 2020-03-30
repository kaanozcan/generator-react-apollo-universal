import { ApolloClient, addTypename } from "apollo-client";
import { onError } from "apollo-link-error";
import { getMainDefinition } from "apollo-utilities";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-fetch";
import { Agent } from "https";
import { BatchHttpLink } from "apollo-link-batch-http";
//import { SchemaLink } from 'apollo-link-schema';

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
  const memoryCache = new InMemoryCache({
    dataIdFromObject: (data) => {
      if (data.id) {
        return `${data.__typename}(${data.id})`;
      } else {
        return null;
      }
    }
  });

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
    cache.writeData({
      data: {
        clientState
      }
    });
  }

  return apolloClient;
};
