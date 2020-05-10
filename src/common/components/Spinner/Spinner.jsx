// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { IBaseProps } from '../../types';

import styles from './styles';

interface IProps extends IBaseProps {
  children: any;
  loading: boolean;
}

function Spinner(props: IProps) {
  const { classes, children, loading } = props;
  return (
    <div className={classes.container}>
      {
        loading && (
          <div className={classes.progressLayer}>
            <CircularProgress
              className={classes.progress}
              size={60}
              thickness={4}
            />
          </div>
        )
      }
      {children}
    </div>
  );
}

export default withStyles(styles)(Spinner);
