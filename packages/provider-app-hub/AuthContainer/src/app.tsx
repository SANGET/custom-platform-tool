import React, { FC } from 'react';
import './styles/App.less';

import {
  Switch, Route, Link, BrowserRouter
} from 'react-router-dom';
import Home from './features/Home';
import EditTable from './features/EditTable';
import TransferTree from './features/TransTree';
import DragTree from './features/DragTree';

const App: FC = () => (
  <BrowserRouter>
    <div className="flex-container">
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">树形穿梭</Link>
            </li>
            <li>
              <Link to="/editTable">编辑表格</Link>
            </li>
            <li>
              <Link to="/dragTree">拖拽树</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Switch>
          <Route exact path="/" component={TransferTree} />
          <Route path="/editTable" component={EditTable} />
          <Route path="/dragTree" component={DragTree} />
        </Switch>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
