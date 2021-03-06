
import checkboxStyles from '../../../../common/material-ui/assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch';

const EditCategoryStyles = {
  ...checkboxStyles,
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
  },
  formControl: {
    paddingTop: 0,
  },
  selectMenu: {
    fontSize: 14,
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default EditCategoryStyles;
