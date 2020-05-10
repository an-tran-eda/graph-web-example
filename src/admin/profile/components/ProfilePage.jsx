// @flow

import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import validate from 'validate.js';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import PermIdentity from '@material-ui/icons/PermIdentity';

import GridContainer from '../../../common/material-ui/components/Grid/GridContainer';
import GridItem from '../../../common/material-ui/components/Grid/GridItem';
import Button from '../../../common/material-ui/components/CustomButtons/Button';
import Clearfix from '../../../common/material-ui/components/Clearfix/Clearfix';
import Card from '../../../common/material-ui/components/Card/Card';
import CardBody from '../../../common/material-ui/components/Card/CardBody';
import CardHeader from '../../../common/material-ui/components/Card/CardHeader';
import CardIcon from '../../../common/material-ui/components/Card/CardIcon';
import { IBaseProps, IGraphQLData, IAppRedux } from '../../../common/types';
import { withGraph } from '../../../common/graphql';
import TextField from '../../../common/components/TextField';
import { withErrorHandler } from '../../../common/error';
import Spinner from '../../../common/components/Spinner';

import { withMainLayout } from '../../hoc';

import styles from './styles';

interface UserAdminProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  roles: Array<string>;
  status: string;
}

interface IProps extends IBaseProps {
  data: IGraphQLData<UserAdminProfile>
}

function ProfilePage(props: IProps) {
  const {
    classes, data, mutate, handleSubmit, setError,
  } = props;

  const { loading, error } = data;

  useEffect(() => {
    if (error) {
      setError(error);
    }
  });
  async function handleOnSubmit(values) {
    try {
      const userProfileData = {
        email: values.email,
        username: values.username,
        firstname: values.firstname,
        lastname: values.lastname,
      };
      await mutate({ variables: userProfileData });
    } catch (submitError) {
      throw new SubmissionError({
        _error: submitError.message,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <PermIdentity />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Edit Profile -
                <small>
                  Complete your profile
                </small>
              </h4>
            </CardHeader>
            <Spinner loading={loading}>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <Field
                      name="companyname"
                      labelText="Company (disabled)"
                      id="company-disabled"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <Field
                      labelText="Username"
                      id="username"
                      name="username"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Field
                      labelText="Email address"
                      id="email-address"
                      name="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <Field
                      labelText="First Name"
                      id="first-name"
                      name="firstname"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Field
                      labelText="Last Name"
                      id="last-name"
                      name="lastname"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Field
                      labelText="City"
                      id="city"
                      name="city"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Field
                      labelText="Country"
                      id="country"
                      name="country"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Field
                      labelText="Postal Code"
                      id="postal-code"
                      name="post-code"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <InputLabel style={{ color: '#AAAAAA' }}>About me</InputLabel>
                    <Field
                      labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                      id="about-me"
                      name="about-me"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 5,
                      }}
                      component={TextField}
                    />
                  </GridItem>
                </GridContainer>
                <Button type="submit" color="rose" className={classes.updateProfileButton}>
                  Update Profile
                </Button>
                <Clearfix />
              </CardBody>
            </Spinner>
          </Card>
        </GridItem>
      </GridContainer>
    </form>
  );
}

const mapStateToProps = (state: IAppRedux, props: IProps) => {
  const {
    data: {
      adminGetProfile,
    },
  } = props;
  return {
    initialValues: adminGetProfile,
  };
};

export default compose(
  withMainLayout,
  withStyles(styles),
  withErrorHandler,
  withGraph(gql`
    mutation adminUpdateProfile(
      $email: String!,
      $username: String,
      $firstname: String,
      $lastname: String,
      $password: String,
      $currentPassword: String,
    ){
      adminUpdateProfile(
        email: $email,
        username: $username,
        firstname: $firstname,
        lastname: $lastname,
        password: $password,
        currentPassword: $currentPassword,
      ) {
        id,
        email,
        firstname,
        lastname,
        username,
        roles,
        status
      }
    }
  `),
  withGraph(gql`
    query {
      adminGetProfile {
        id,
        email,
        firstname,
        lastname,
        username,
        roles,
        status
      }
    }
  `),
  connect(mapStateToProps),
  reduxForm({
    form: 'editProfile',
    destroyOnUnmount: false,
    validate: (data) => {
      const constraints = {
        email: {
          presence: { allowEmpty: false },
        },
      };
      const errors = validate(data, constraints, { format: 'grouped' }) || {};
      return errors;
    },
  }),
)(ProfilePage);
