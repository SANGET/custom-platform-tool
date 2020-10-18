import React from 'react';

interface FieldSelectorProps {
  interDatasources
  onSubmit
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  interDatasources,
  onSubmit
}) => {
  return (
    <div className="field-selector">
      Field selector
    </div>
  );
};
