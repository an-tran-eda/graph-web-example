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
import CheckIcon from '@material-ui/icons/Check';
import RemoveIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// App commons
import FormLabel from '@material-ui/core/FormLabel';
import styles from './EditUserPage.styles';
import withMainLayout from '../../../hoc/withMainLayout';

// Material Components
// import Button from '../../../../common/material-ui/components/CustomButtons/Button';
import Card from '../../../../common/material-ui/components/Card/Card';
import CardBody from '../../../../common/material-ui/components/Card/CardBody';
import CardIcon from '../../../../common/material-ui/components/Card/CardIcon';
import CardHeader from '../../../../common/material-ui/components/Card/CardHeader';
import GridContainer from '../../../../common/material-ui/components/Grid/GridContainer';
import GridItem from '../../../../common/material-ui/components/Grid/GridItem';
import CustomInput from '../../../../common/material-ui/components/CustomInput/CustomInput';

// Constants
import UserRoles from '../../../../constants/UserRoles';
import { withGraph } from '../../../../common/graphql';

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

const updateUser = gql`
  mutation updateUser(
    $id: ID!
    $firstname: String
    $lastname: String
    $email: String
    $roles: [String]
    $status: AccountStatus
  ) {
    updateUser(
      id: $id
      firstname: $firstname
      lastname: $lastname
      email: $email
      roles: $roles
      status: $status
    ) {
      id
    }
  }
`;

function EditUserPage({ ...props }) {
  const { classes, data, mutate } = props;
  const [user, setUser] = useState({});

  function renderUserRoleMenuItem() {
    return Object.keys(UserRoles).map(role => (
      <MenuItem
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected,
        }}
        value={UserRoles[role]}
      >
        {UserRoles[role]}
      </MenuItem>
    ));
  }

  function isDusted() {
    return (
      (user.firstname !== data.getUser.firstname)
      || (user.lastname !== data.getUser.lastname)
      || (user.email !== data.getUser.email)
      || (user.roles[0] !== data.getUser.roles[0])
      || (user.status !== data.getUser.status)
    );
  }

  async function submitUser() {
    if (isDusted() && mutate) {
      await mutate({
        variables: user,
        refetchQueries: () => ['adminGetUsers'],
      });
    }
  }

  useEffect(() => {
    if (data.getUser) {
      setUser(data.getUser);
    }
  }, [data.getUser]);

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
              variant="outlined"
              color="primary"
              className={classes.smallButton}
            >
              <RemoveIcon />
              CANCEL
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.smallButton}
              onClick={submitUser}
            >
              <CheckIcon />
              SAVE
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <GridContainer justify="flex-start" spacing={24}>
          <GridItem xs={3} sm={3} className={classes.userInfo}>
            <FormLabel>First Name</FormLabel>
            <CustomInput
              id="firstname"
              formControlProps={{
                className: classes.formControl,
                fullWidth: true,
              }}
              inputProps={{
                defaultValue: data.getUser.firstname,
                onChange: event => setUser({ ...user, firstname: event.target.value }),
              }}
            />
          </GridItem>
          <GridItem xs={3} sm={3} className={classes.userInfo}>
            <FormLabel>Last Name</FormLabel>
            <CustomInput
              id="lastname"
              formControlProps={{
                className: classes.formControl,
                fullWidth: true,
              }}
              inputProps={{
                defaultValue: data.getUser.lastname,
                onChange: event => setUser({ ...user, lastname: event.target.value }),
              }}
            />
          </GridItem>
          <GridItem xs={6} sm={6} className={classes.userInfo}>
            <FormLabel>User Role</FormLabel>
            <FormControl fullWidth className={classes.selectFormControl}>
              <Select
                MenuProps={{
                  className: classes.selectMenu,
                }}
                classes={{
                  select: classes.select,
                }}
                value={data.getUser.roles[0]}
                onChange={event => setUser({ ...user, roles: [event.target.value] })}
                inputProps={{
                  name: 'userRole',
                  id: 'user-role',
                }}
              >
                {renderUserRoleMenuItem()}
              </Select>
            </FormControl>
          </GridItem>
          <GridItem xs={6} sm={6} className={classes.userInfo}>
            <FormLabel>Email</FormLabel>
            <CustomInput
              id="email"
              formControlProps={{
                className: classes.formControl,
                fullWidth: true,
              }}
              inputProps={{
                defaultValue: data.getUser.email,
                onChange: event => setUser({ ...user, email: [event.target.value] }),
              }}
            />
          </GridItem>
          <GridItem xs={3} sm={3} className={classes.userInfo}>
            <FormLabel>Created on</FormLabel>
            <CustomInput
              id="createdon"
              formControlProps={{
                className: classes.formControl,
                fullWidth: true,
              }}
              inputProps={{ defaultValue: '22 Jul 2018' }}
            />
          </GridItem>
          <GridItem xs={3} sm={3} className={classes.userInfo}>
            <FormLabel>Last Updated on</FormLabel>
            <CustomInput
              id="lastupdatedon"
              formControlProps={{
                className: classes.formControl,
                fullWidth: true,
              }}
              inputProps={{ defaultValue: '22 Jul 2018' }}
            />
          </GridItem>
          <GridItem xs={6} sm={6} className={classes.userInfo}>
            <FormLabel>Status</FormLabel>
            <FormControl fullWidth className={classes.selectFormControl}>
              <Select
                MenuProps={{
                  className: classes.selectMenu,
                }}
                classes={{
                  select: classes.select,
                }}
                value={data.getUser.status}
                onChange={event => setUser({ ...user, status: event.target.value })}
                inputProps={{
                  name: 'status',
                  id: 'status',
                }}
              >
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected,
                  }}
                  value="ACTIVE"
                >
                  ACTIVE
                </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected,
                  }}
                  value="INACTIVE"
                >
                  INACTIVE
                </MenuItem>
              </Select>
            </FormControl>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
}

EditUserPage.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
};

export default compose(
  withMainLayout,
  withRouter,
  withStyle(styles),
  graphql(query, queryOptions),
  withGraph(updateUser),
)(EditUserPage);
