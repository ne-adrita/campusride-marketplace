import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = { sm: 'h-6 w-6 border-2', md: 'h-10 w-10 border-3', lg: 'h-16 w-16 border-4' };
  const spinner = <div className={`animate-spin rounded-full ${sizes[size] || sizes.md} border-primary-600 border-t-transparent`} role="status" aria-label="Loading" />;

  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">{spinner}</div>;
  }
  return <div className="flex justify-center items-center p-8">{spinner}</div>;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullScreen: PropTypes.bool,
};

export default LoadingSpinner;
