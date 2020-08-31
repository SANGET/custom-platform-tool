import React from 'react';

import { createGlobalStyle, ThemeContext } from 'styled-components';

import '../style/index.scss';

const LocalGlobalStyle = createGlobalStyle`
`;

export default function Style(props) {
  return (
    <>
      <LocalGlobalStyle />
    </>
  );
}
