import extendedTablesStyle from '../../../../common/material-ui/assets/jss/material-dashboard-pro-react/views/extendedTablesStyle';

const viewUserPage = {
  ...extendedTablesStyle,
  alignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  cardIconTitle: {
    ...extendedTablesStyle.cardIconTitle,
    float: 'left',
  },
  floatRight: {
    float: 'right',
  },
};

export default viewUserPage;
