import React from "react";
import { hot } from "react-hot-loader";
import {
  HashRouter as Router, Switch, Route, Link
} from "react-router-dom";
import { Provider, connect } from "unistore/react";

import HomePage from "./pages/home";
import {
  authStore,
  authActions,
  AuthActions,
  AuthStore
} from "./auth/actions/store";

import "./style.scss";
import LoginSelector from "./auth/selector";
import routers from "./config/routers";

interface AppProps extends AuthActions, AuthStore {
  // username?: string;
}

class App extends React.Component<AppProps, {}> {
  state = {
    ready: false
  };

  componentDidMount() {
    this.props.autoLogin();
  }

  render() {
    const {
      autoLoging,
      login,
      logout,
      isLogin,
      logging,
      loginResDesc
    } = this.props;
    return (
      <LoginSelector
        loginResDesc={loginResDesc}
        logging={logging}
        autoLoging={autoLoging}
        isLogin={isLogin}
        login={login}
        logout={logout}>
        <Router>
          <div>
            <nav>
              <ul>
                {routers.map(({ path, name, component }) => (
                  <li key={path}>
                    <Link to={path}>{name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            {routers.map(({ path, name, component }) => {
              const C = component;
              return (
                <Route key={path} path={path}>
                  <C />
                </Route>
              );
            })}
          </div>
        </Router>
        {/* <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/users">Users</Link>
                </li>
              </ul>
            </nav>
            <Switch>
              <Route path="/about">
                <div>
                  <h2>React 工程脚手架</h2>
                  <ul>
                    <li>支持 SCSS</li>
                    <li>支持 hot loader</li>
                    <li>webpack 4</li>
                    <li>typescript</li>
                  </ul>
                </div>
              </Route>
              <Route path="/users">
                <div>users</div>
              </Route>
              <Route path="/">
                <HomePage />
              </Route>
            </Switch>
          </div>
        </Router> */}
      </LoginSelector>
    );
  }
}

function selector(state) {
  return state;
}

const LoginFilterWithStore = connect(
  selector,
  authActions
)((userStore) => <App {...userStore} />);

const C = () => (
  <Provider store={authStore}>
    <LoginFilterWithStore />
  </Provider>
);

export default hot(module)(C);
