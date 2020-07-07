import React, { FC } from 'react';
import './styles/App.less';

import {
  Switch, Route, Link, BrowserRouter
} from 'react-router-dom';
import Home from './features/Home';
import EditTable from './features/EditTable';
import TransferTree from './features/TransTree';

const App: FC = () => (
  <BrowserRouter>
    <div className="flex-container">
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/editTable">editTable</Link>
            </li>
            <li>
              <Link to="/transferTree">transferTree</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/editTable" component={EditTable} />
          <Route path="/transferTree" component={TransferTree} />
        </Switch>
      </main>
    </div>
  </BrowserRouter>
);

export { App };
