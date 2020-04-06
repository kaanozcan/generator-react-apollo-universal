import "core-js/stable";
import regeneratorRuntime from "regenerator-runtime/runtime";
import React from "react";
import ReactDom from "react-dom";
import Site from "@src/components/Site";
import Bootstrap from "@lib/components/Bootstrap";
import createApolloClient from "@lib/utils/apollo-client";
import StyleContext from 'isomorphic-style-loader/StyleContext'

__webpack_public_path__ = window.location.origin + "/assets/bundle/";

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss())
  return () => removeCss.forEach(dispose => dispose())
}

/**
 *
 * @constructor
 */
function DOMContentLoaded () {
  const element = document.getElementById("app-root");

  const apolloState = JSON.parse(decodeURIComponent(element.getAttribute("data-apollo-state")));

  const apolloClient = createApolloClient({
    initialData: apolloState
  });

  ReactDom.hydrate(
    <StyleContext.Provider value={{ insertCss }}>
      <Bootstrap apolloClient={apolloClient} component={Site} />
    </StyleContext.Provider>,
    element
  );

}

document.addEventListener("DOMContentLoaded", DOMContentLoaded);
