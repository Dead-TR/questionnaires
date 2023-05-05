import React, { Component, ErrorInfo, Suspense } from "react";

import type { ErrorProps } from "./components/ErrorComponent";
import ErrorPage from "./components/ErrorComponent";
import Providers from "containers/Providers";
import Layout from "containers/Layout";

interface State {
  error?: ErrorProps;
}

class App extends Component {
  state: State = {};

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);

    this.setState({
      error: {
        title: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      },
    });
  }

  render() {
    const { error } = this.state;

    return (
      <Suspense fallback={null}>
        {!!error ? (
          <ErrorPage {...error} />
        ) : (
          <Providers>
            <Layout />
          </Providers>
        )}
      </Suspense>
    );
  }
}

export default App;
