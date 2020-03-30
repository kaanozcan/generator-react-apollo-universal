import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import useStyles from "isomorphic-style-loader/useStyles";
import styles from "./index.css";

const TODOS = gql`
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

  const todos = (data && data.todos || []).map(({ title, completed }, i) => {
    const isCompleted = completed ? (
      <div className={styles.completedCheck}>	&#10004;</div>
    ) : null;

    return (
      <div key={i} className={styles.todoItem}>{title}{isCompleted}</div>
    );
  });

  return (
    <div className={styles.container}>
      {todos}
    </div>
  );
}
