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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// @material-ui/icons
import Check from '@material-ui/icons/Check';
// core components
// @material-ui/icons
import Close from '@material-ui/icons/Close';
// App common
import { withGraph } from '../../../../common/graphql';
// core components
import Button from '../../../../common/material-ui/components/CustomButtons/Button';
import GridContainer from '../../../../common/material-ui/components/Grid/GridContainer';
import GridItem from '../../../../common/material-ui/components/Grid/GridItem';
import CustomInput from '../../../../common/material-ui/components/CustomInput/CustomInput';

import styles from './AddCategoryModal.style';

const createCategoryMutation = gql`
  mutation createServiceCategory(
    $name: String!
    $active: Boolean!
  ) {
    createServiceCategory(
      name: $name
      active: $active
    ) {
      name
    }
  }
`;

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function AddCategoryModal(props) {
  const {
    classes, open, onClose, mutate,
  } = props;
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  async function handleSubmit() {
    if (mutate) {
      const categoryData = {
        name,
        active,
      };
      await mutate({
        variables: categoryData,
        refetchQueries: () => ['getServiceCategories'],
      });
      onClose();
    }
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
          <h4 className={classes.modalTitle}>Add Category</h4>
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={classes.modalBody}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12}>
              <CustomInput
                labelText={<span>Category Name</span>}
                id="name"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  onChange: event => setName(event.target.value),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12}>
              <div className={`${classes.checkboxAndRadio} ${classes.checkboxAndRadioHorizontal}`}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      tabIndex={-1}
                      checked={active}
                      onClick={() => setActive(!active)}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{ checked: classes.checked }}
                    />
                  )}
                  classes={{ label: classes.label }}
                  label="Active"
                />
              </div>
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

AddCategoryModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
};

export default compose(
  withStyles(styles),
  withGraph(createCategoryMutation),
)(AddCategoryModal);
