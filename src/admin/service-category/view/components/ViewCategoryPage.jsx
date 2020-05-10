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
import CategoryRounded from '@material-ui/icons/CategoryRounded';
import withStyle from '@material-ui/core/styles/withStyles';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

// App commons
import styles from './ViewCategoryPage.style';
import withMainLayout from '../../../hoc/withMainLayout';

// Material Components
// import Button from '../../../../common/material-ui/components/CustomButtons/Button';
import Card from '../../../../common/material-ui/components/Card/Card';
import CardBody from '../../../../common/material-ui/components/Card/CardBody';
import CardIcon from '../../../../common/material-ui/components/Card/CardIcon';
import CardHeader from '../../../../common/material-ui/components/Card/CardHeader';
import GridContainer from '../../../../common/material-ui/components/Grid/GridContainer';
import GridItem from '../../../../common/material-ui/components/Grid/GridItem';

const query = gql`
  query getServiceCategory($id: ID!) {
    getServiceCategory(id: $id) {
      id
      name
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

function ViewCategoryPage(props) {
  const {
    classes,
    data,
    history,
    match,
  } = props;

  function onEditCategory() {
    const location = {
      pathname: `/admin/service-categories/edit/${match.params.id}`,
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
          <CategoryRounded />
        </CardIcon>
        <div className={classes.headerContainer}>
          <h4 className={classes.cardIconTitle}>Service Category Details</h4>
          <div className={classes.headerActions}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.smallButton}
              onClick={onEditCategory}
            >
              <EditIcon />
              EDIT
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <GridContainer justify="flex-start" spacing={24}>
          <GridItem xs={3} sm={3} className={classes.categoryInfo}>
            <label>Category Name</label>
            <div className="info">{data.getServiceCategory.name}</div>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
}

ViewCategoryPage.propTypes = {
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
)(ViewCategoryPage);
