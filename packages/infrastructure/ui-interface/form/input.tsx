import React from "react";

interface InputProps {
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void);
}

const Input: React.SFC<InputProps> = ({
  onChange
}) => {
  return <input type="text" onChange={onChange} />;
};

export default Input;
