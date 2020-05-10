import React from 'react';
import PropTypes from 'prop-types';
import './StatusBadge.scss';

// Status
const STATUS = {
  ACTIVE: {
    label: 'Active',
    className: 'active',
  },
  INACTIVE: {
    label: 'Inactive',
    className: 'inactive',
  },
};

function StatusBadge(props) {
  const { label, className } = props;
  return (
    <div className={`status-badge ${className} ${STATUS[label].className}`}>
      {label}
    </div>
  );
}

StatusBadge.defaultProps = {
  label: '',
  className: '',
};

StatusBadge.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
};

export default React.memo(StatusBadge);
