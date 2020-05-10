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

// Custom components
import StatusBadge from '../StatusBadge';

// Material Components
import Table from '../../../../../common/material-ui/components/Table/Table';
import Button from '../../../../../common/material-ui/components/CustomButtons/Button';

const deleteUser = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id) {
      email
    }
  }
`;

const TABLE_FORMAT = [
  {
    header: 'First Name',
    key: 'firstname',
    sort: true,
  },
  {
    header: 'Last Name',
    key: 'lastname',
    sort: true,
  },
  {
    header: 'Email',
    key: 'email',
  },
  {
    header: 'User Role',
    key: 'roles',
    sort: true,
  },
  {
    header: 'Status',
    key: 'status',
    sort: true,
    component: StatusBadge,
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


function UserTable({ ...props }) {
  const {
    classes,
    users,
    mutate,
    history,
  } = props;
  const [tableUser, setTableUser] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  // Convert json data to ;array
  const intDataUsers = [];

  // Handle remove User
  function removeUser(id) {
    mutate({
      variables: { id },
      refetchQueries: () => ['adminGetUsers'],
    });
  }

  function userAction(event, action, id) {
    event.stopPropagation();
    switch (action) {
      case 'edit':
        props.handleEditUser(id);
        break;
      case 'delete':
        removeUser(id);
        break;
      default:
        break;
    }
  }

  // Format user data before load to table
  function formatTableUsers(userData = intDataUsers) {
    // const { users } = userData;
    return userData.map(user => TABLE_FORMAT.map((col) => {
      // column has a component
      if (col.component) {
        return <col.component className="center-cell" label={user[col.key]} />;
      }
      // Render action buttons
      if (col.actions) {
        return col.actions.map(prop => (
          <Button
            color={prop.color}
            customClass={classes.actionButton}
            key={prop.key}
            onClick={event => userAction(event, prop.key, user.id)}
          >
            <prop.icon className={classes.icon} />
          </Button>
        ));
      }
      return user[col.key];
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

  function onViewUser(key) {
    const location = {
      pathname: `/admin/users/view/${users[key].id}`,
    };
    history.push(location);
  }

  useEffect(() => {
    setTableUser(formatTableUsers(users));
  }, [users]);

  return (
    <div>
      <Table
        tableHead={TABLE_FORMAT}
        tableData={tableUser}
        customCellClasses={[classes.center, classes.right]}
        // 4 is for classes.center
        customClassesForCells={[4, 5]}
        customHeadCellClasses={[classes.center]}
        // 4 is for classes.center
        customHeadClassesForCells={[4]}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        onRowClick={onViewUser}
      />
    </div>
  );
}

UserTable.propTypes = {
  classes: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired,
  handleRequestSort: PropTypes.func,
  handleEditUser: PropTypes.func,
  history: PropTypes.object.isRequired,
};

UserTable.defaultProps = {
  handleRequestSort: () => {},
  handleEditUser: () => {},
};

export default compose(
  withRouter,
  withStyle(extendedTablesStyle),
  withGraph(deleteUser),
)(UserTable);
