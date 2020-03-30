import React, { Component } from "react";

const defaultState = {
  hasError: false,
  error: null,
  info: null
};

class ErrorBoundary extends Component {
  constructor (props, context) {
    super(props, context);

    this.state = defaultState;
  }

  componentDidCatch (error, info) {
    this.setState({
      hasError: true,
      error,
      info
    });

    console.log("Error Happened React tree:\n", error, info);
  }

  render () {
    if (this.state.hasError) {
      return (
        <div>
          <p>Error. Please try again later.</p>
          <br />
          {JSON.stringify(this.state.error, null, "/n", null)}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
