import React from 'react';

import '@deer-ui/core/default.css';
import { createGlobalStyle, ThemeContext } from 'styled-components';

import './style.scss';

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
    &.hovering {
      
    }
    &.selected {

    }
  }
`;

export function GlobalStyle(props) {
  return (
    <>
      <LocalGlobalStyle />
    </>
  );
}
