import React, { Components } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { ApolloProvider } from "react-apollo";
import ErrorBoundary from "@lib/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

const getRouter = () => {
  if (process.env.browser === true) {
    return require("react-router-dom").BrowserRouter;
  } else {
    return require("react-router").StaticRouter;
  }
};

const Bootstrap = ({ location, helmetContext, routerContext, apolloClient, component, render }) => {
  const Router = getRouter(),
        Component = component;

  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <HelmetProvider context={helmetContext}>
          <Router location={location} context={routerContext}>
            <Route path="/" component={Component} render={render} />
          </Router>
        </HelmetProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

Bootstrap.propTypes = {
  location: PropTypes.string,
  helmetContext: PropTypes.object,
  routerContext: PropTypes.object,
  apolloClient: PropTypes.object,
  component: PropTypes.elementType,
  render: PropTypes.func
};

export default Bootstrap;
