import React from "react";
import { renderToString } from "react-dom/server";
import createApolloClient from "@lib/utils/apollo-client";
import { renderToStringWithData } from "react-apollo";
import Bootstrap from "@lib/components/Bootstrap";
import config from "config";
import StyleContext from "isomorphic-style-loader/StyleContext";
import bundleManifest from "./public/bundle/manifest.json";
import Site from "@src/components/Site";

const getDocument = (markup, helmetContext, css, apolloState) => {
  const state = encodeURIComponent(JSON.stringify(apolloState));

  return `
    <!DOCTYPE html>
    <html lang="tr" dir="ltr">
      <head>
          <!-- Meta -->
          ${helmetContext.helmet.meta.toString()}
          <!-- Title -->
          ${helmetContext.helmet.title.toString()}
          <!-- Script -->
          ${helmetContext.helmet.script.toString()}
          <!-- Link -->
          ${helmetContext.helmet.link.toString()}

          <style>${[...css].join('')}</style>

      </head>
      <body>
        <div id="app-root" data-apollo-state="${state}">
          ${markup}
        </div>
      </body>
    </html>
  `;
}

export default function siteRenderer (req, res, next) {
  const routerContext = {},
        helmetContext = {};

  const css = new Set() // CSS for all rendered React components
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))

  const clientState = {
    __typename: "ClientState",
    bundleManifest: {
      __typename: "BundleManifest",
      bundle: bundleManifest["bundle.js"],
      vendor: bundleManifest["vendor.js"]
    }
  };

  const apolloClient = createApolloClient({
    baseUrl: config.get("server.host"),
    ssrMode: true,
    clientState,
    resolvers: {},
    req,
  });

  renderToStringWithData(
    <StyleContext.Provider value={{ insertCss }}>
      <Bootstrap location={req.url}
        component={Site}
        routerContext={routerContext}
        helmetContext={helmetContext}
        apolloClient={apolloClient}
      />
    </StyleContext.Provider>
  ).then((markup) => {
    if (routerContext.url) {
      return res.redirect(302, routerContext.url);
    }

    const apolloState = apolloClient.extract();

    const document = getDocument(markup, helmetContext, css, apolloState);

    res.status(200).send(document);
  })
  .catch((err) => {
    next(err);
  });
}
