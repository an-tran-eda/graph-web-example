import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import blue from '@material-ui/core/colors/blue';

const btnStyle = {
  loadingStyle: {
    color: blue[500],
    marginTop: -12,
    animation: 'none',
  },
  loadingContainer: {
    marginRight: '5px',
  },
};
function withLoadingButton(WrappedComponent) {
  const LoadingButton = (props) => {
    const {
      loading,
      children,
      ...otherProps
    } = props;
    return (
      <WrappedComponent disabled={loading} {...otherProps}>
        {loading
          && (
            <span style={btnStyle.loadingContainer}>
              <CircularProgress style={btnStyle.loadingStyle} size={18} />
            </span>
          )}
        <span>{children}</span>
      </WrappedComponent>
    );
  };
  LoadingButton.propTypes = {
    loading: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };
  LoadingButton.defaultProps = {
    loading: false,
  };
  return LoadingButton;
}
export default withLoadingButton;
