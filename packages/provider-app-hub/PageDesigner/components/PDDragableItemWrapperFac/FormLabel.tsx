import React from 'react';

const FormLabel = ({
  children,
  className = '',
  ...props
}) => (
  children ? (
    <div
      className="control-label form-title"
      {...props}
    >
      {children}
    </div>
  ) : null
);
