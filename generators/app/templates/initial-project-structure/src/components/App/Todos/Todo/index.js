import React from "react";
import PropTypes from "prop-types";
import styles from "../index.css";

const Todo = ({ title, completed }) => {
  const isCompleted = completed ? (
    <div className={styles.completedCheck}>	&#10004;</div>
  ) : null;

  return (
    <div className={styles.todoItem}>{title}{isCompleted}</div>
  );
}

export default Todo;
