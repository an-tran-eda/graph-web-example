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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// App commons
import FormLabel from '@material-ui/core/FormLabel';
import styles from './EditCategoryPage.style';
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
import { withGraph } from '../../../../common/graphql';

const query = gql`
  query getServiceCategory($id: ID!) {
    getServiceCategory(id: $id) {
      id
      name
      active
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

const updateServiceCategory = gql`
  mutation updateServiceCategory(
    $id: ID!
    $name: String
    $active: Boolean
  ) {
    updateServiceCategory(
      id: $id
      name: $name
      active: $active
    ) {
      id
      name
    }
  }
`;

function EditCategoryPage({ ...props }) {
  const { classes, data, mutate } = props;
  const [category, setCategory] = useState({});

  function isDusted() {
    return (
      (category.name !== data.getServiceCategory.name)
      || (category.active !== data.getServiceCategory.active)
    );
  }

  async function submitCategory() {
    if (isDusted() && mutate) {
      await mutate({
        variables: category,
        refetchQueries: () => ['getServiceCategories'],
      });
    }
  }

  useEffect(() => {
    if (data.getServiceCategory) {
      setCategory({ ...data.getServiceCategory });
    }
  }, [data.getServiceCategory]);

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
          <h4 className={classes.cardIconTitle}>Edit Service Category</h4>
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
              onClick={submitCategory}
            >
              <CheckIcon />
              SAVE
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <GridContainer justify="flex-start" spacing={24}>
          <GridItem xs={6} sm={6} className={classes.userInfo}>
            <FormLabel>Service Category Name</FormLabel>
            <CustomInput
              id="name"
              formControlProps={{
                className: classes.formControl,
                fullWidth: true,
              }}
              inputProps={{
                defaultValue: data.getServiceCategory.name,
                onChange: event => setCategory({ ...category, name: event.target.value }),
              }}
            />
          </GridItem>
          <GridItem xs={6} sm={6} className={classes.alignCenter}>
            <div className={`${classes.checkboxAndRadio} ${classes.checkboxAndRadioHorizontal}`}>
              <FormControlLabel
                control={(
                  <Checkbox
                    tabIndex={-1}
                    defaultChecked={data.getServiceCategory.active}
                    checked={category.active}
                    onClick={() => setCategory({ ...category, active: !category.active })}
                    checkedIcon={<CheckIcon className={classes.checkedIcon} />}
                    icon={<CheckIcon className={classes.uncheckedIcon} />}
                    classes={{ checked: classes.checked }}
                  />
                )}
                classes={{ label: classes.label }}
                label="Active"
              />
            </div>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
}

EditCategoryPage.propTypes = {
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
  withGraph(updateServiceCategory),
)(EditCategoryPage);
