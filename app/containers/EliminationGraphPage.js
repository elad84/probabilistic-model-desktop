import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {RaisedButton} from "material-ui";
import EliminationGraphComponent from "../components/unit3/EliminationGraph";
import {eliminateNode, findNextElimination, toMoralized} from "../actions/eliminationGraph";
import BinaryMembership from "../components/BinaryMembership";
import {resetEliminationGraph} from "../actions/dependencyGraph";

const style = {
  margin: 12
};

const mapDispatchToProps = dispatch => bindActionCreators({eliminateNode, toMoralized, findNextElimination, resetEliminationGraph}, dispatch);

function mapStateToProps(state) {
  const {graphData, activeAlgo} = state;
  return {
    graph: graphData.eliminationGraph,
    networkName: graphData.graph.networkFile,
    algo: activeAlgo,
    graphData : {
      nodes : graphData.nodes,
      nodesMap : graphData.nodesMap,
      networkType : graphData.networkType,
      layersCount : graphData.layersCount
    }
  };
}

type Props = {
  graphData: Object,
  networkName: string,
  toMoralized: () => void,
  graph: Object,
  algo: string,
  eliminateNode: () => void,
  findNextElimination: () => void,
  resetEliminationGraph: () => void
};

class Unit3Container extends Component<Props> {

  constructor(props){
    super(props);
    const graphData =  {
      nodes : props.graphData.nodes,
      nodesMap : props.graphData.nodesMap,
      networkType : props.graphData.networkType,
      layersCount : props.graphData.layersCount
    };
    const {toMoralized, networkName, algo, graph} = props;
    toMoralized(networkName, algo.id, graph, graphData)
  }

  state = {
    chosenNode: null
  };

  handleNodeChosen(node) {
    const chosenNode = node.nodes[0];
    this.setState({
      chosenNode
    });
  }

  resetGraph() {
    const {resetEliminationGraph} = this.props;
    this.setState({
      chosenNode : null
    });

    resetEliminationGraph();
  }

  render() {
    // eslint-disable-next-line no-shadow
    const {graphData, networkName, toMoralized, graph, algo, eliminateNode, findNextElimination} = this.props;
    const {chosenNode} = this.state;
    return (
      <div style={{width: '100%'}}>
        {/* <RaisedButton label="Convert to moralized" style={style} */}
        {/*              onClick={() => toMoralized(networkName, algo.id, graph, graphData)}/> */}
        <RaisedButton label="Eliminate Node" style={style}
                      onClick={() => eliminateNode(chosenNode, graph)}/>
        <RaisedButton label="Find Perfect Elimination" style={style}
                      onClick={() => findNextElimination(graph)}/>
        <RaisedButton className="reset" label="Reset Network" style={style}
                      onClick={() => this.resetGraph()}/>
        <EliminationGraphComponent graph={graph} handleNode={this.handleNodeChosen.bind(this)}/>
        <BinaryMembership/>
      </div>
    );
  }
}

const Unit3ContainerObj = connect(mapStateToProps, mapDispatchToProps)(Unit3Container);
export default Unit3ContainerObj;
