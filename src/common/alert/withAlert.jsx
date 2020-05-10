import React, { useContext } from 'react';
import AlertContext from './context';

const withAlert = (WrappedComponent) => {
  const AlertWrapper = (props) => {
    const { showError, showSuccess } = useContext(AlertContext);
    return (
      <WrappedComponent {...props} showError={showError} showSuccess={showSuccess} />
    );
  };

  return AlertWrapper;
};

export default withAlert;
