import React, { Component } from 'react';
import { getComponentName } from '../utils/core';
// import Raven from '../utils/sentry';

/**
 * Higher order component catch error in child components and render an error page
 *
 * If user is authenticated, the wrapped component is rendered
 * else, set browser url to a passed login url
 *
 * @param {Mixed} ErrorPage react component for displaying error
 */
const ErrorBoundary = (WrappedComponent) => {
  class Wrapper extends Component {
    state = {
      hasError: false,
    }

    componentDidCatch() {
      this.setState({
        hasError: true,
        // error,
        // info,
      });
      // Raven.captureException(error, info);
    }

    render() {
      const { hasError } = this.state;
      return hasError
        ? <p>Error</p>
        : <WrappedComponent {...this.props} />;
    }
  }

  Wrapper.displayName = `ErrorBoundary(${getComponentName(WrappedComponent)})`;
  return Wrapper;
};

export default ErrorBoundary;
