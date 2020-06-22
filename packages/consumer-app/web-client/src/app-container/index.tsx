import React from 'react';

import { RouterMultiple } from 'multiple-page-routing';

class AppContainer extends RouterMultiple {
  render() {
    const { children } = this.props;
    return (
      <div id="app-container">
        {children}
      </div>
    );
  }
}

export default AppContainer;
