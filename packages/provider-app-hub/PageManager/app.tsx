import React from 'react';
import ReactDOM from 'react-dom';

// import PageDesigner from '@provider-app/page-designer';

const App = () => {
  return (
    <div>
      <h2>页面管理器</h2>
      <div
        onClick={async (e) => {
          history.pushState({}, '页面设计器', '/page-designer');
          const PageDesigner = (await import('@provider-app/page-designer')).PageDesignerApp;
          ReactDOM.render(<PageDesigner />, document.querySelector('#Main'));
        }}
      >创建页面</div>
      <ul>
        <li>页面1，点击管理</li>
      </ul>
    </div>
  );
};

export default App;
