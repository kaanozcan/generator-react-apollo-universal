import React from "react";
import App from "../App";
import gql from "graphql-tag";
import { Switch, Route } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import useStyles from "isomorphic-style-loader/useStyles";
import styles from "./index.css";
import { Helmet } from "react-helmet-async";

const BUNLE_MANIFEST = gql`
  {
    clientState @client {
      bundleManifest {
        bundle
        vendor
      }
    }
  }
`;

const Site = (props) => {
  useStyles(styles);
  const { data, loading, error } = useQuery(BUNLE_MANIFEST, { errorPolicy: "all" });

  if (loading) {
    return null;
  }

  const { bundleManifest } = data.clientState;

  return (
    <>
      <Helmet>
        <script src={`/public/bundle/${bundleManifest.vendor}`} />
        <script src={`/public/bundle/${bundleManifest.bundle}`} />
      </Helmet>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </>
  );
};

export default Site;
