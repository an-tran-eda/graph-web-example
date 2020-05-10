import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import validate from 'validate.js';
import { compose } from 'redux';

// @material-ui/core components
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';

// @material-ui/icons
import Email from '@material-ui/icons/Email';
import withStyles from '@material-ui/core/styles/withStyles';
import loginPageStyle from '../../../common/material-ui/assets/jss/material-dashboard-pro-react/views/loginPageStyle';
import Card from '../../../common/material-ui/components/Card/Card';
import CardBody from '../../../common/material-ui/components/Card/CardBody';
import CardHeader from '../../../common/material-ui/components/Card/CardHeader';
import CardFooter from '../../../common/material-ui/components/Card/CardFooter';
import AppButton from '../../../common/components/AppButton';
// core components
import TextField from '../../../common/components/TextField';

const formClass = {
  footer: {
    display: 'block',
    textAlign: 'center',
  },
  submitButton: {
    paddingBottom: '10px',
  },
};
function LoginForm(props) {
  const { classes, handleSubmit, submitting } = props;
  const [cardAnimaton, setCardAnimaton] = useState('cardHidden');
  useEffect(() => {
    const timer = setTimeout(
      () => setCardAnimaton(''),
      700,
    );

    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <Card login className={classes[cardAnimaton]}>
      <CardHeader
        className={`${classes.cardHeader} ${classes.textCenter}`}
        color="rose"
      >
        <h4 className={classes.cardTitle}>Log in</h4>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} id="loginForm">
          <Field
            name="email"
            labelText="Email"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Email className={classes.inputAdornmentIcon} />
                </InputAdornment>
              ),
            }}
            component={TextField}
          />

          <Field
            name="password"
            labelText="Password"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'password',
              endAdornment: (
                <InputAdornment position="end">
                  <Icon className={classes.inputAdornmentIcon}>
                    lock_outline
                  </Icon>
                </InputAdornment>
              ),
            }}
            component={TextField}
          />
        </form>
      </CardBody>
      <CardFooter className={classes.justifyContentCenter}>
        <div style={formClass.footer}>
          <AppButton style={formClass.submitButton} type="submit" form="loginForm" loading={submitting} color="rose" simple size="lg" block>
            Login
          </AppButton>
          <NavLink to="/admin/forgot-password">
            Forgot password
          </NavLink>
        </div>
      </CardFooter>
    </Card>

  );
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default compose(
  withStyles(loginPageStyle),
  reduxForm({
    form: 'loginForm',
    enableReinitialize: true,
    validate: (data) => {
      const constraints = {
        email: {
          presence: { allowEmpty: false },
        },
        password: {
          presence: { allowEmpty: false },
        },
      };
      const errors = validate(data, constraints, { format: 'grouped' }) || {};
      return errors;
    },
  }),
)(LoginForm);
