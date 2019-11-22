import React, {Component} from 'react';
import {connect} from "react-redux";
import {remote} from "electron";
import {bindActionCreators} from "redux";
import AlgoDetail from './AlgoPage';
import NavigationBar from '../components/NavigationBar';
import {loadNetwork} from "../actions/graph";

type Props = {
  loadNetwork: () => void,
  networkName: string
};


class AllAlgo extends Component<Props> {

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

  render() {
    const {networkName} = this.props;
    return (
      <div>
        <NavigationBar loadNetwork={this.loadNetwork.bind(this)}/>
        <div style={{display:'flex', 'flexDirection': 'column'}}>
          <div style={{width: '100%', height: '30px', color: 'black', 'marginTop' : '20px'}}>Network Name: {networkName}</div>
          <AlgoDetail/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    folderPath: state.graphData.folderPath,
    networkName: state.graphData.networkName,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadNetwork}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllAlgo);
