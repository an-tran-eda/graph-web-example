import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

// GraphQL
import gql from 'graphql-tag';

// material-ui components
import withStyle from '@material-ui/core/styles/withStyles';
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import extendedTablesStyle from '../../../../../common/material-ui/assets/jss/material-dashboard-pro-react/views/extendedTablesStyle';


// App commons
import { withGraph } from '../../../../../common/graphql';

// Material Components
import Table from '../../../../../common/material-ui/components/Table/Table';
import Button from '../../../../../common/material-ui/components/CustomButtons/Button';

const deleteCategory = gql`
  mutation deleteServiceCategory($id: ID!) {
    deleteServiceCategory(id: $id) {
      name
    }
  }
`;

const TABLE_FORMAT = [
  {
    header: 'Service Category Name',
    key: 'name',
    sort: true,
  },
  {
    header: '',
    key: 'actions',
    actions: [
      { color: 'success', icon: Edit, key: 'edit' },
      { color: 'danger', icon: Close, key: 'delete' },
    ],
  },
];


function CategoryTable({ ...props }) {
  const {
    classes,
    categories,
    mutate,
    history,
  } = props;
  const [tableCategory, setTableCategory] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  // Convert json data to ;array
  const intDataCategories = [];

  // Handle remove User
  function removeCategory(id) {
    mutate({
      variables: { id },
      refetchQueries: () => ['getServiceCategories'],
    });
  }

  function categoryAction(event, action, id) {
    event.stopPropagation();
    switch (action) {
      case 'edit':
        props.handleEditCategory(id);
        break;
      case 'delete':
        removeCategory(id);
        break;
      default:
        break;
    }
  }

  // Format user data before load to table
  function formatTableCategories(categoriesData = intDataCategories) {
    // const { users } = userData;
    return categoriesData.map(category => TABLE_FORMAT.map((col) => {
      // column has a component
      if (col.component) {
        return <col.component className="center-cell" label={category[col.key]} />;
      }
      // Render action buttons
      if (col.actions) {
        return col.actions.map(prop => (
          <Button
            color={prop.color}
            customClass={classes.actionButton}
            key={prop.key}
            onClick={event => categoryAction(event, prop.key, category.id)}
          >
            <prop.icon className={classes.icon} />
          </Button>
        ));
      }
      return category[col.key];
    }));
  }

  // Handle request sort when click on table header
  function handleRequestSort(event, property) {
    const newOrderBy = property;
    let newOrder = 'desc';

    if (orderBy === property && order === 'desc') {
      newOrder = 'asc';
    }

    setOrder(newOrder);
    setOrderBy(newOrderBy);
    props.handleRequestSort();
  }

  function onViewCategory(key) {
    const location = {
      pathname: `/admin/service-categories/view/${categories[key].id}`,
    };
    history.push(location);
  }

  useEffect(() => {
    setTableCategory(formatTableCategories(categories));
  }, [categories]);

  return (
    <div>
      <Table
        tableHead={TABLE_FORMAT}
        tableData={tableCategory}
        customCellClasses={[classes.right]}
        // 1 is for classes.right
        customClassesForCells={[1]}
        customHeadCellClasses={[classes.right]}
        // 1 is for classes.right
        customHeadClassesForCells={[1]}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        onRowClick={onViewCategory}
      />
    </div>
  );
}

CategoryTable.propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired,
  handleRequestSort: PropTypes.func,
  handleEditCategory: PropTypes.func,
  history: PropTypes.object.isRequired,
};

CategoryTable.defaultProps = {
  handleRequestSort: () => {},
  handleEditCategory: () => {},
};

export default compose(
  withRouter,
  withStyle(extendedTablesStyle),
  withGraph(deleteCategory),
)(CategoryTable);
