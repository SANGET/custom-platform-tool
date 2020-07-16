import React, { FC } from 'react';
import './styles/index.less';

import {
  Switch, Route, Link, BrowserRouter
} from 'react-router-dom';
// import Home from './features/Home';
// import EditTable from './features/EditTable';
import authItem from './features/authItem';
import authTree from './features/authTree';
// import TreeSelectTransfer from './features/TreeSelectTransfer';

const App: FC = () => (
  <BrowserRouter>
    <div className="app-container">
      <header>
        <nav>
          <ul className="menu">
            <li>
              <Link to="/">权限项</Link>
            </li>
            {/* <li>
              <Link to="/editTable">编辑表格</Link>
            </li> */}
            <li>
              <Link to="/dragTree">权限树</Link>
            </li>
            {/* <li>
              <Link to="/TreeSelectTransfer">穿梭树选择器</Link>
            </li> */}
          </ul>
        </nav>
      </header>
      <main>
        <Switch>
          <Route exact path="/" component={authItem} />
          {/* <Route path="/editTable" component={EditTable} /> */}
          <Route path="/dragTree" component={authTree} />
          {/* <Route path="/TreeSelectTransfer" component={TreeSelectTransfer} /> */}
        </Switch>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
