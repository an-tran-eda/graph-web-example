import userProfileStyles from '../../../../common/material-ui/assets/jss/material-dashboard-pro-react/views/userProfileStyles';

const viewUserPage = {
  ...userProfileStyles,
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerActions: {
    marginTop: '15px',
  },
  smallButton: {
    fontSize: 10,
    marginRight: '10px',
    '& svg': {
      width: '1em',
      height: '1em',
      margin: '0 1em 0 0',
      fontSize: 12,
    },
  },
  userInfo: {
    marginTop: '20px',
    '& label': {
      fontSize: 12,
    },
    '& info': {
      fontSize: 14,
      margin: '0',
    },
  },
};

export default viewUserPage;
