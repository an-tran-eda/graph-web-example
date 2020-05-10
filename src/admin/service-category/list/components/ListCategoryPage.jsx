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
import styles from './ListCategoryPage.style';
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

// Custom Components
import CategoryTable from './CategoryTable/CategoryTable';
import AddCategoryTable from '../../add/components/AddCategoryModal';

const query = gql`
  query getServiceCategories(
    $page: Int! = 0
    $limit: Int! = 5
    $filter: String
  ) {
    getServiceCategories(page: $page, limit: $limit, filter: $filter) {
      categories {
        id
        name
      }
      totalCount
      totalPage
      page
      filter
    }
  }
`;

function ListCategoryPage({ ...props }) {
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
    data.refetch({ page: values - 1, filter: searchText });
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
    data.refetch({ page: 0, filter: event.target.value });
  }

  function getCurrentPage() {
    const currentPage = pagination.find(page => page.active);
    if (currentPage) return currentPage.text - 1;
    return 0;
  }

  function handleEditCategory(id) {
    const location = {
      pathname: `/admin/service-categories/edit/${id}`,
      state: { userList: true },
    };
    history.push(location);
  }

  useEffect(() => {
    // Pre-process data
    formatPagination(data.getServiceCategories);
  }, [data.getServiceCategories]);

  return (
    <div>
      <AddCategoryTable
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
          <h4 className={classes.cardIconTitle}>Service Categories</h4>
          <CustomInput
            labelText="Search Category"
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
          <CategoryTable
            categories={data.getServiceCategories ? data.getServiceCategories.categories : []}
            handleEditCategory={handleEditCategory}
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

ListCategoryPage.propTypes = {
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
)(ListCategoryPage);
