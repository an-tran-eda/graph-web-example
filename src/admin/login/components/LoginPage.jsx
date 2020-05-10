import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import { Redirect, withRouter } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// core components

import LoginForm from './LoginForm';
import loginPageStyle from '../../../common/material-ui/assets/jss/material-dashboard-pro-react/views/loginPageStyle';
import { withGuestLayout } from '../../hoc';
import { withIdentity } from '../../../common/identity';
import { withErrorHandler } from '../../../common/error';

function LoginPage(props) {
  // const [cardAnimaton, setCardAnimaton] = useState('cardHidden');
  const [redirectToReferrer, setRedirect] = useState(false);
  // const [loading, setLoading] = useState(false);
  const {
    mutate, setIdentity, location, setError,
  } = props;
  async function handleSubmit(values) {
    try {
      const resp = await mutate({ variables: values });
      const data = resp.data.login;
      setIdentity(data.user, { value: data.value, expireAt: data.expireAt });
      setRedirect(true);
    } catch (error) {
      setError(error);
    }
  }

  const { from } = location.state || { from: { pathname: '/' } };
  if (redirectToReferrer) return <Redirect to={from} />;

  const initValues = {
    email: 'john@mailinator.com',
    password: '1',
  };
  return (
    <LoginForm onSubmit={handleSubmit} initialValues={initValues} />
  );
}
LoginPage.propTypes = {
  // classes: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
  setIdentity: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default compose(
  withGuestLayout,
  withStyles(loginPageStyle),
  withIdentity('admin'),
  withRouter,
  withErrorHandler,
  graphql(gql`
    mutation login($email: String, $password: String){
      login(email: $email, password: $password) {
        value
        expireAt
        user {
          id
          email
          firstname
          lastname
        }
      }
    }
  `),
)(LoginPage);
