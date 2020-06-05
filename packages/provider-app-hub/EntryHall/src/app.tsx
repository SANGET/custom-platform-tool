import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import DataManager from '@provider-app/data-manager/app';
import PageManager from '@provider-app/page-manager/app';
import MenuManager from '@provider-app/menu-manager/app';

import Hall from './Hall';

interface HallState {

}

const App = () => {
  const state: HallState = {};
  return (
    <div>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">工作台</Link>
              </li>
              <li>
                <Link to="/menu-manager">菜单管理</Link>
              </li>
              <li>
                <Link to="/page-manager">页面管理</Link>
              </li>
              <li>
                <Link to="/data-manager">数据管理</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/menu-manager">
              <MenuManager {...state} />
            </Route>
            <Route path="/page-manager">
              <PageManager />
            </Route>
            <Route path="/data-manager">
              <DataManager />
            </Route>
            <Route path="/">
              <Hall />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.querySelector('#Main')
);
