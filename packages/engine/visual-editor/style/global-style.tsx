import React from 'react';

import '@deer-ui/core/default.css';
import { createGlobalStyle, ThemeContext } from 'styled-components';

const LocalGlobalStyle = createGlobalStyle`
  pre {
    white-space: normal;
  }
  a {
    color: inherit;
    text-decoration: none;

    :hover {
      /* color: #CCC; */
      text-decoration: none;
    }
  }
  .state-mark {
    pointer-events: none;
    border: 1px solid transparent;
  }
`;

export function GlobalStyle(props) {
  return (
    <>
      <LocalGlobalStyle />
    </>
  );
}
