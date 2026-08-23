import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ name, src = null, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  const initials = name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (src) {
    return <img src={src} alt={name} className={`rounded-full object-cover ${sizes[size]} ${className}`} />;
  }

  return (
    <div className={`rounded-full bg-primary-100 text-primary-600 font-semibold flex items-center justify-center ${sizes[size]} ${className}`}>
      {initials}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default React.memo(Avatar);
