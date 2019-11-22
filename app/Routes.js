import React from 'react';
import {Route, Switch} from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import NewGraph from "./containers/CreateGraph";
import EditGraph from "./containers/EditNetwork";
import AllAlgo from "./containers/AllAlgoPage";

export default () => (
  <App>
    <Switch>
      <Route path={routes.CREATE} component={NewGraph}/>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.EDIT} component={EditGraph} />
      <Route path={routes.ALGO} component={AllAlgo} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
