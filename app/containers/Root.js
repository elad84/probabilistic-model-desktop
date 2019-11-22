// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import {remote} from "electron";
import axios from "axios";
import {applyMiddleware as dispatch} from "redux";
import type { Store } from '../reducers/types';
import Routes from '../Routes';
import {chooseFolder} from "../actions/graph";


type Props = {
  store: Store,
  history: {}
};

const dialogOptions = {
  type: 'info',
  title: 'Root Folder',
  message: "Please choose a root folder for your project",
  buttons: ['Ok']
};

export default class Root extends Component<Props> {

  componentDidMount() {
    // remote.dialog.showMessageBox(dialogOptions, (index) => {
    //   console.log('information-dialog-selection', index);
    // });
    // // remote.app.getPath('home');
    // remote.dialog
    //   .showOpenDialog({
    //     properties: ['openFile', 'openDirectory', 'multiSelections'],
    //     defaultPath: "/Users/eladcohen/Documents/idc/study/probabilistic models",
    //   }, (result) => {
    //     console.log(result);
    //     const name = result[0];
    //     axios.post('http://localhost:8080/general/choose', {path : name})
    //       .then(response => {
    //         if (response.status === 200) {
    //           dispatch(chooseFolder(name));
    //           alert(`Saved Successfully as ${name}`);
    //         } else {
    //           alert("Failed to save network");
    //         }
    //         return true;
    //       })
    //       .catch(reason=>console.log(reason));
    //   });
    // .then(result => {
    //   console.log(result);
    //   return result;
    // })
    // .catch(err => {
    //   console.error(err);
    // });
  }

  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}
