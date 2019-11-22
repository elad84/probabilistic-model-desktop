// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.css';
import MainGraph from "./MainGraph";
import NavigationBar from "./NavigationBar";
import {remote} from "electron";
import {Route} from "react-router";


const graphStyle = {
  height: "400px",
  border: "1px solid gray"
};

const dialogOptions = {
  type: 'info',
  title: 'Root Folder',
  message: "Please choose a root folder for your project",
  buttons: ['Ok']
};


type Props = {
  folderPath: string,
  loadNetwork: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  loadNetwork(history) {
    const {folderPath} = this.props;
    remote.dialog
      .showOpenDialog({
        properties: ['openFile'],
        defaultPath: folderPath,
      }, (result) => {
        if(!result) {
          return;
        }
        const {loadNetwork: loadNetwork1} = this.props;
        loadNetwork1(result[0], history);
      });
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <NavigationBar loadNetwork={this.loadNetwork.bind(this)}/>
        {/* <div className={styles.centerContainer}><h2>Home</h2></div> */}
        {/* <Link to="/create"> */}
        {/*  <div className="btn btn-primary btn-lg" role="button">Create New Graph</div> */}
        {/* </Link> */}
        {/* <Route render={({history}) => ( */}
        {/*  <div className="btn btn-primary btn-lg" role="button" onClick={() => {this.loadNetwork(history)}}>Load Graph</div> */}
        {/* )}/> */}
        {/* < Route render={({history}) => ( */}
        {/*  <FlatButton label="Load Network" containerElement='label' labelPosition="before" */}
        {/*              style={{position: 'absolute', right: 220}}> */}
        {/*     <input type="file" onChange={(e) => this.props.loadNetwork(e.target.files[0].name, history)}/> */}
        {/*  </FlatButton> */}
        {/* )}/> */}
        {/* <Route render = {({history}) => ( */}
        {/*  <RaisedButton label="Load example 1" onClick={ () => {this.props.loadNetwork('example1.txt', history)}} /> */}
        {/* )}/> */}
        <div style={graphStyle} className="graph"><MainGraph/></div>
      </div>
    );
  }
}
