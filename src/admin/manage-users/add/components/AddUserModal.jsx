import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import gql from 'graphql-tag';
// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// @material-ui/icons
import Close from '@material-ui/icons/Close';
// App common
import { withGraph } from '../../../../common/graphql';
// core components
import Button from '../../../../common/material-ui/components/CustomButtons/Button';
import GridContainer from '../../../../common/material-ui/components/Grid/GridContainer';
import GridItem from '../../../../common/material-ui/components/Grid/GridItem';
import PictureUpload from '../../../../common/material-ui/components/CustomUpload/PictureUpload';
import CustomInput from '../../../../common/material-ui/components/CustomInput/CustomInput';

import modalStyle from '../../../../common/material-ui/assets/jss/material-dashboard-pro-react/modalStyle';

// Constants
import UserRoles from '../../../../constants/UserRoles';

const createUserMutation = gql`
  mutation createUser(
    $email: String!
    $firstname: String!
    $lastname: String!
    $roles: [String!]
  ) {
    createUser(
      email: $email
      firstname: $firstname
      lastname: $lastname
      roles: $roles
    ) {
      id
      email
      firstname
      lastname
    }
  }
`;

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function AddUserModal(props) {
  const {
    classes, open, onClose, mutate,
  } = props;
  const [userRole, setUserRole] = useState('CLIENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  async function handleSubmit() {
    if (mutate) {
      const userData = {
        firstname: firstName,
        lastname: lastName,
        email,
        roles: [userRole],
      };
      await mutate({
        variables: userData,
        refetchQueries: () => ['adminGetUsers'],
      });
      onClose();
    }
  }

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

  return (
    <div>
      <Dialog
        classes={{
          root: classes.center,
          paper: classes.modal,
        }}
        open={open}
        transition={Transition}
        keepMounted
        onClose={onClose}
        aria-labelledby="modal-slide-title"
        aria-describedby="modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            justIcon
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={onClose}
          >
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>Add User</h4>
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={classes.modalBody}
        >
          <PictureUpload />
          <GridContainer justify="center">
            <GridItem xs={12} sm={6}>
              <CustomInput
                labelText={<span>First Name</span>}
                id="firstname"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  onChange: event => setFirstName(event.target.value),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <CustomInput
                labelText={<span>Last Name</span>}
                id="lastname"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  onChange: event => setLastName(event.target.value),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12}>
              <CustomInput
                labelText={<span>Email</span>}
                id="email"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: 'email',
                  onChange: event => setEmail(event.target.value),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="simple-select"
                  className={classes.selectLabel}
                >
                  User Role
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu,
                  }}
                  classes={{
                    select: classes.select,
                  }}
                  value={userRole}
                  onChange={event => setUserRole(event.target.value)}
                  inputProps={{
                    name: 'userrole',
                    id: 'user-role',
                  }}
                >
                  {renderUserRoleMenuItem()}
                </Select>
              </FormControl>
            </GridItem>
          </GridContainer>
        </DialogContent>
        <DialogActions
          className={`${classes.modalFooter} ${classes.modalFooterCenter}`}
        >
          <Button onClick={handleSubmit} color="info">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

AddUserModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
};

export default compose(
  withStyles(modalStyle),
  withGraph(createUserMutation),
)(AddUserModal);
