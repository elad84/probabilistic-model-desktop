import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {RaisedButton} from "material-ui";
import axios from "axios";
import {checkDependency, resetMoralizeGraph, toMoralized} from "../actions/dependencyGraph";
import Unit3ContainerObj from "./EliminationGraphPage";
import Unit4ComponentObj from "./Unit4Page";
import Unit1ContainerObj from "./DependencyGraphPage";
import {toBayesianNetwork} from "../reducers/graph";
import ChordalGraphComponent from "../components/unit2/ChordalGraphComponent";

const style = {
  margin: 12
};
const graphStyle = {
  height: "400px",
  border: "1px solid gray"
};

function mapDispatchToProps(dispatch) {
  // Whenever selectAlgo is called, the result should be passed
  // to all of our reducers
  return bindActionCreators({checkDependency, toMoralized, resetMoralizeGraph}, dispatch);
}

type Props = {
  graphData: Object,
  networkName: string,
  toMoralized: () => void,
  graph: Object,
  algo: number,
  resetMoralizeGraph: () => void
};

class AlgoDetail extends Component<Props> {

  state = {
    // eslint-disable-next-line react/no-unused-state,react/no-unused-state
    observedNodes: [],
    // eslint-disable-next-line react/no-unused-state
    dialogOpen: false
  };

  handleNodeChosen(node) {
    const chosenNode = node.nodes[0];
    const {observed, observedMode} = this.state;
    if (observedMode) {
      this.setState({
        observed: observed.concat(node)
      });
    } else {
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        chosenNode
      });
    }
  }

  // observed dialog functions
  setObserved(observedNodes) {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      observedNodes
    });
  }

  closeDialog() {
    // eslint-disable-next-line react/no-unused-state
    this.setState({dialogOpen: false});
  }

  chooseObserved() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      dialogOpen: true
    });
  }

  // eslint-disable-next-line class-methods-use-this
  checkChordal(fileName, graph, graphData) {
    const request = axios.post(`http://localhost:8080/bayesian/chordal?name=${  fileName}`,
      toBayesianNetwork(graph, graphData.nodes, graphData.nodesMap, graphData.name, graphData.networkType, graphData.layersCount));
    // eslint-disable-next-line promise/catch-or-return
    request.then((response) => {
      // eslint-disable-next-line promise/always-return
      if(response.data){
        alert("Graph is chordal");
      }else {
        alert("Graph is not chordal");
      }
    });
  }


  render() {
    // API exemple
    const {algo: algo1} = this.props;
    if (!algo1) {
      return <div>Select a algo to get started.</div>;
    }
    switch (algo1.id) {
      case 1:
        return <Unit1ContainerObj/>;
      case 2:
        const {graphData, networkName, toMoralized: toMoralized1, graph, algo, resetMoralizeGraph} = this.props;
        return (
          <div style={{width: '100%'}}>
            <RaisedButton label="Convert to moralized" style={style}
                          onClick={() => toMoralized1(networkName, algo.id,
                            graph, graphData)}/>
            <RaisedButton label="Check chordal" style={style}
                          onClick={() => this.checkChordal(networkName, graph, graphData)}/>
            <RaisedButton className="reset" label="Reset Network" style={style}
                          onClick={() => resetMoralizeGraph()}/>
            {/* <RaisedButton label="Choose Observed Node" style={style} onClick={this.chooseObserved.bind(this)}/> */}
            {/* <RaisedButton label="Check Dependency" style={style} */}
            {/* onClick={() => this.props.checkDependency(this.state.chosenNode, this.state.observed)}/> */}
            <div style={graphStyle}><ChordalGraphComponent graph={graph}/></div>
          </div>
        );
      case 3:
        return <Unit3ContainerObj/>;
      case 4:
        return <Unit4ComponentObj/>;
      default:
        break;
    }
  }
}

function mapStateToProps(state) {
  return {
    algo: state.activeAlgo,
    graph: state.graphData.moralizeGraph,
    networkName: state.graphData.networkFile,
    graphData : {
      nodes : state.graphData.nodes,
      nodesMap : state.graphData.nodesMap,
      networkType : state.graphData.networkType,
      layersCount : state.graphData.layersCount
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AlgoDetail);

