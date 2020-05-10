import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

// material-ui components
import Assignment from '@material-ui/icons/Assignment';
import withStyle from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/AddSharp';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

// GraphQL
import gql from 'graphql-tag';

// App commons
import styles from './ListUserPage.styles';
import withMainLayout from '../../../hoc/withMainLayout';
import { withGraph } from '../../../../common/graphql';

// Material Components
import Button from '../../../../common/material-ui/components/CustomButtons/Button';
import Card from '../../../../common/material-ui/components/Card/Card';
import CardBody from '../../../../common/material-ui/components/Card/CardBody';
import CardIcon from '../../../../common/material-ui/components/Card/CardIcon';
import CardHeader from '../../../../common/material-ui/components/Card/CardHeader';
import Paginations from '../../../../common/material-ui/components/Pagination/Pagination';
import CustomInput from '../../../../common/material-ui/components/CustomInput/CustomInput';

// Custom components
import AddUserModal from '../../add/index';
import UserTable from './UserTable/UserTable';

const query = gql`
  query adminGetUsers($page: Int! = 0, $limit: Int! = 3, $search: String) {
    adminGetUsers(page: $page, limit: $limit, search: $search) {
      users {
        id
        lastname
        status
        firstname
        roles
        email
      }
      totalCount
      totalPage
      page
      search
    }
  }
`;

function ListUserPage({ ...props }) {
  const { classes, data, history } = props;
  const [isOpenModal, toggleModal] = useState(false);
  const [pagination, setPagination] = useState([
    { text: 'PREV' },
    { active: true, text: 1 },
    { text: 'NEXT' }]);
  const [searchText, setSearchText] = useState('');


  // Handle paginations
  function handlePaging(e, values) {
    const newPagination = pagination.map((page) => {
      if (page.text === values) {
        return { active: true, text: values };
      }
      return { text: page.text };
    });
    setPagination(newPagination);
    data.refetch({ page: values - 1, search: searchText });
  }

  const initPaginationData = { totalPage: 0, page: 0 };
  function formatPagination(paginationData = initPaginationData) {
    const { totalPage, page } = paginationData;

    const currentPage = page;
    const result = [];
    let i = 0;
    while (i < totalPage) {
      if (i === currentPage) {
        result.push({
          text: i + 1,
          active: true,
        });
      } else {
        result.push({
          text: i + 1,
        });
      }
      i += 1;
    }
    setPagination(result);
  }

  function handleSearch(event) {
    setSearchText(event.target.value);
    data.refetch({ page: 0, search: event.target.value });
  }

  function getCurrentPage() {
    const currentPage = pagination.find(page => page.active);
    if (currentPage) return currentPage.text - 1;
    return 0;
  }

  function handleEditUser(id) {
    const location = {
      pathname: `/admin/users/edit/${id}`,
      state: { userList: true },
    };
    history.push(location);
  }

  useEffect(() => {
    // Pre-process data
    formatPagination(data.adminGetUsers);
  }, [data.adminGetUsers]);

  return (
    <div>
      <AddUserModal
        open={isOpenModal}
        onClose={() => toggleModal(!isOpenModal)}
      />
      <div className={classes.alignRight}>
        <Button
          style={{ backgroundColor: '#2ac1a8' }}
          onClick={() => toggleModal(true)}
        >
          <AddIcon />
          ADD
        </Button>
      </div>
      <Card style={{ marginBottom: '0px' }}>
        <CardHeader color="rose" icon>
          <CardIcon color="rose">
            <Assignment />
          </CardIcon>
          <h4 className={classes.cardIconTitle}>Admin Accounts</h4>
          <CustomInput
            labelText="Search User"
            id="material"
            formControlProps={{
              className: classes.floatRight,
            }}
            inputProps={{
              endAdornment: (<InputAdornment position="end"><SearchIcon /></InputAdornment>),
              onChange: handleSearch,
              value: searchText,
            }}
          />
        </CardHeader>
        <CardBody>
          <UserTable
            users={data.adminGetUsers ? data.adminGetUsers.users : []}
            handleEditUser={handleEditUser}
          />
        </CardBody>
      </Card>
      <div className={classes.alignRight}>
        <Paginations
          onClick={handlePaging}
          pages={pagination}
          color="info"
        />
      </div>
    </div>
  );
}

ListUserPage.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  mutate: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
export default compose(
  withMainLayout,
  withRouter,
  withStyle(styles),
  withGraph(query),
)(ListUserPage);
