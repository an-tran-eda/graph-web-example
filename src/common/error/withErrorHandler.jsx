import React from 'react';
import PropTypes from 'prop-types';
// import { SubmissionError } from 'redux-form';
import HTTP_STATUS_CODE from './constants';
import { withAlert } from '../alert';
// import { IdentityContext } from '../identity';

const withErrorHandler = (WrappedComponent) => {
  class ErrorBoundary extends React.Component {
    state = { hasError: false }

    setError = (error) => {
      const { showError, clearIdentity } = this.props;
      const { graphQLErrors } = error;
      if (graphQLErrors.length > 0) {
        graphQLErrors.map((err) => {
          const { extensions: { code } } = err;
          let { message } = err;
          switch (code) {
            case HTTP_STATUS_CODE.UNAUTHENTICATED:
              // 401 Unauthen - redirect to login page
              clearIdentity();
              message = 'Please login to continue.';
              break;
            case HTTP_STATUS_CODE.FORBIDDEN: break;
            case HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR: break;
            case HTTP_STATUS_CODE.BAD_USER_INPUT: break;
            default:
          }
          return showError(message);
        });
      } else if (error.networkError) {
        showError('Network error , please check your network connection !');
      }
    }
    // showError(error);
    // this.setState({ hasError: true });
    // if form submission error
    // throw new SubmissionError({
    //   email: 'Email is invalid',
    //   password: 'Password is wrong',
    //   _error: error.message,
    // });


    componentDidCatch() {
      this.setState({ hasError: true });
    }

    render() {
      const { props } = this;
      const { hasError } = this.state;
      if (hasError) {
        return 'some error occured';
      }

      return <WrappedComponent setError={this.setError} {...props} />;
    }
  }

  ErrorBoundary.propTypes = {
    showError: PropTypes.func.isRequired,
    clearIdentity: PropTypes.func.isRequired,
  };

  return withAlert(ErrorBoundary);
};

export default withErrorHandler;
