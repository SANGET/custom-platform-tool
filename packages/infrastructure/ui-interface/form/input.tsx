import React from 'react';

interface InputProps {
  onChange: (event) => void;
}

const Input: React.SFC<InputProps> = () => {
  return (
    <input type="text"/>
  );
};

export default Input;
