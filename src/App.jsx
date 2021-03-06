// @flow
import React, { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ApolloProvider } from 'react-apollo';
import { hot } from 'react-hot-loader/root';
import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom';
import routes from './routes';
import store from './store';
import client from './client';
import { IdentityProvider } from './common/identity';

export const history = createBrowserHistory();

function App() {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <IdentityProvider>
          <Router history={history} key={Math.random()}>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                {routes.map(r => (
                  <Route
                    key={r.name}
                    path={r.path}
                    render={() => <r.component />}
                    exact
                  />
                ))}
                <Route path="/" render={() => <Redirect to="/admin/dashboard" />} exact />
                {/* <Route component={NoMatch} /> */}
              </Switch>
            </Suspense>
          </Router>
        </IdentityProvider>
      </ApolloProvider>
    </ReduxProvider>
  );
}

export default hot(App);
