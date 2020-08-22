import React from "react";
import { useQuery, gql } from "@apollo/client";
import Todo from "./Todo";
import useStyles from "isomorphic-style-loader/useStyles";
import styles from "./index.css";

export const TODOS = gql`
  {
    todos {
      title
      completed
    }
  }
`;

export default () => {
  useStyles(styles);
  const { data, loading } = useQuery(TODOS, { errorPolicy: "all", fetchPolicy: "cache" });

  if (loading) {
    return (<div>Loading...</div>);
  }

  const todos = (data && data.todos || []).map((todo, i) => (<Todo key={i} {...todo} />));

  return (
    <div className={styles.container}>
      {todos}
    </div>
  );
}
