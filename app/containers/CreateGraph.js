import React, {Component} from 'react';
import {connect} from "react-redux";
import {Route} from "react-router";
import {RaisedButton, TextField} from "material-ui";
import {remote} from "electron";
import {bindActionCreators} from "redux";

import NavigationBar from '../components/NavigationBar';
import NetworkTypeSelect from "../components/create/NetworkTypeSelect";
import {createGraph, loadNetwork} from "../actions/graph";
import {isBlank, isNotBlank} from "../utils/Util";



const style = {
  margin: 12
};

const mapDispatchToProps = (dispatch) => bindActionCreators({createGraph, loadNetwork}, dispatch);

// const mapDispatchToProps = dispatch => ({
//   createNetwork: (name, count, type, layerCount, history) => {
//     dispatch(createGraph({
//       name,
//       count,
//       type,
//       layerCount
//     }));
//     history.push("/edit");
//   },
//   loadNetwork
// });

type Props = {
  createNetwork: () => void,
  loadNetwork: () => void
};

class ConnectedNewGraph extends Component<Props> {

  state = {
    networkType : 'GENERAL',
    name: null,
    nodeCount: 0,
    layerCount: 1,
    nameError: "",
    countError: ""
  };

  createNetwork(name, count, type, layerCount, history) {
    let hasErrors = false;
    if(isBlank(name)) {
      this.setState({
        nameError: "Must provide a network name"
      });
      hasErrors = true;
    }

    if(count < 1) {
      this.setState({
        countError: "Must provide number of nodes"
      });
      hasErrors = true;
    }

    if(hasErrors) {
       return;
    }
    const {createGraph} = this.props;
    createGraph({name, count, type, layerCount});
    history.push("/edit");
  }

  handleTypeSelected(event, index, value) {
    this.setState({
      networkType : value
    });
  }

  loadNetwork(history) {
    remote.dialog
      .showOpenDialog({
        properties: ['openFile'],
      }, (result) => {
        if(!result) {
          return;
        }
        const {loadNetwork: loadNetwork1} = this.props;
        loadNetwork1(result[0], history);
      });
  }

  nameChanged(value) {
    this.setState({ name: value });
    if(isNotBlank(value)){
      this.setState({ nameError: ""});
    }
  }

  countChanged(value) {
    this.setState({ nodeCount: value });
    if(isNotBlank(value)){
      this.setState({ countError: ""});
    }
  }



  render() {
    const {networkType, name, nodeCount, layerCount, nameError, countError} = this.state;
    // const {createNetwork} = this.props;
    const layersButton = networkType === 'ITERATIVE' ?  <div><TextField
      hintText="1"
      floatingLabelText="Number of Layers"
      onBlur={e => this.setState({ layerCount: e.target.value })}
    /> </div> : <div/>
    return (
      <div>
        <NavigationBar loadNetwork={this.loadNetwork.bind(this)}/>
        <NetworkTypeSelect clickHandler={this.handleTypeSelected.bind(this)} ref={(networkTypeSelect) => {this.networkTypeSelect = networkTypeSelect;}}/>
        <div>
          <TextField
            hintText="Network Name"
            floatingLabelText="Network Name"
            required
            errorText={nameError}
            // error={nameError.length !== 0 }
            onChange={e => this.nameChanged(e.target.value)}
            onBlur={e => this.nameChanged(e.target.value)}
          />
        </div>
        <div>
          <TextField
            hintText="1"
            floatingLabelText="Number of Nodes"
            required
            errorText={countError}
            // error={countError.length !== 0 }
            onChange={e => this.countChanged(e.target.value)}
            onBlur={e => this.countChanged(e.target.value)}
          />
        </div>
        {layersButton}
        <Route render = {({history}) => (
          <RaisedButton label="Create New Network" style={style} onClick={ () =>
          {
            this.createNetwork(name, nodeCount, networkType, layerCount, history)}
          } />
        )}/>

      </div>
    );
  }
}

const NewGraph = connect(null, mapDispatchToProps)(ConnectedNewGraph);
export default NewGraph;

