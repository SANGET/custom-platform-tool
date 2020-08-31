import React from 'react';

// import '@deer-ui/core/default.css';
import { createGlobalStyle, ThemeContext } from 'styled-components';

import './style.scss';
import "./antd/index.less";

const LocalGlobalStyle = createGlobalStyle`
`;

export default function GlobalStyle(props) {
  return (
    <>
      <LocalGlobalStyle />
    </>
  );
}
