/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

// GraphQL
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

// material-ui components
import AccountCircle from '@material-ui/icons/AccountCircle';
import withStyle from '@material-ui/core/styles/withStyles';
import EditIcon from '@material-ui/icons/Edit';
import ResetIcon from '@material-ui/icons/LockRounded';
import Button from '@material-ui/core/Button';

// App commons
import styles from './ViewUserPage.styles';
import withMainLayout from '../../../hoc/withMainLayout';
import { withGraph } from '../../../../common/graphql';

// Material Components
// import Button from '../../../../common/material-ui/components/CustomButtons/Button';
import Card from '../../../../common/material-ui/components/Card/Card';
import CardBody from '../../../../common/material-ui/components/Card/CardBody';
import CardIcon from '../../../../common/material-ui/components/Card/CardIcon';
import CardHeader from '../../../../common/material-ui/components/Card/CardHeader';
import GridContainer from '../../../../common/material-ui/components/Grid/GridContainer';
import GridItem from '../../../../common/material-ui/components/Grid/GridItem';

// Custom components
import StatusBadge from '../../list/components/StatusBadge';

const query = gql`
  query getUser($id: ID) {
    getUser(id: $id) {
      id
      status
      roles
      firstname
      lastname
      email
    }
  }
`;

const queryOptions = {
  options: ({ match, identity }) => ({
    variables: { id: match.params.id },
    context: {
      headers: {
        authorization: `Bearer ${identity.token.value}`,
      },
    },
  }),
};

function ViewUserPage(props) {
  const {
    classes,
    data,
    history,
    match,
  } = props;

  function onEditUser() {
    const location = {
      pathname: `/admin/users/edit/${match.params.id}`,
      state: { viewUser: true },
    };
    history.push(location);
  }

  if (data.loading) {
    return <div>Loading...</div>;
  }

  if (data.error) {
    return <div>Error!</div>;
  }

  return (
    <Card>
      <CardHeader color="primary" icon>
        <CardIcon color="primary">
          <AccountCircle />
        </CardIcon>
        <div className={classes.headerContainer}>
          <h4 className={classes.cardIconTitle}>Admin Details</h4>
          <div className={classes.headerActions}>
            <Button
              variant="contained"
              color="primary"
              className={classes.smallButton}
            >
              <ResetIcon />
              RESET PASSWORD
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.smallButton}
              onClick={onEditUser}
            >
              <EditIcon />
              EDIT
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <GridContainer justify="flex-start" spacing={24}>
          <GridItem xs={3} sm={3} className={classes.userInfo}>
            <label>First Name</label>
            <div className="info">{data.getUser.firstname}</div>
          </GridItem>
          <GridItem xs={3} sm={3} className={classes.userInfo}>
            <label>Last Name</label>
            <div className="info">{data.getUser.lastname}</div>
          </GridItem>
          <GridItem xs={6} sm={6} className={classes.userInfo}>
            <label>User Role</label>
            <div className="info">{data.getUser.roles}</div>
          </GridItem>
          <GridItem xs={6} sm={6} className={classes.userInfo}>
            <label>Email</label>
            <div className="info">{data.getUser.email}</div>
          </GridItem>
          <GridItem xs={3} sm={3} className={classes.userInfo}>
            <label>Created on</label>
            <div className="info">22 Jul 2018</div>
          </GridItem>
          <GridItem xs={3} sm={3} className={classes.userInfo}>
            <label>Last Updated on</label>
            <div className="info">22 Jul 2018</div>
          </GridItem>
          <GridItem xs={6} sm={6} className={classes.userInfo}>
            <label>Status</label>
            <StatusBadge label={data.getUser.status} />
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
}

ViewUserPage.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withMainLayout,
  withStyle(styles),
  withRouter,
  graphql(query, queryOptions),
)(ViewUserPage);
