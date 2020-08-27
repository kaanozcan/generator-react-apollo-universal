import React from "react";
import App from "../App";
import { gql, useQuery } from "@apollo/client";
import { Switch, Route } from "react-router";
import useStyles from "isomorphic-style-loader/useStyles";
import styles from "./index.css";

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
      <Switch>
        <Route path="/" component={App} />
      </Switch>
      <script src={`/public/bundle/${bundleManifest.vendor}`} />
      <script src={`/public/bundle/${bundleManifest.bundle}`} />
    </>
  );
};

export default Site;
