import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {RaisedButton} from "material-ui";
import EliminationGraphComponent from "../components/unit3/EliminationGraph";
import {eliminateNode, findNextElimination, toMoralized} from "../actions/eliminationGraph";
import BinaryMembership from "../components/BinaryMembership";

const style = {
  margin: 12
};

const mapDispatchToProps = dispatch => bindActionCreators({eliminateNode, toMoralized, findNextElimination}, dispatch);

function mapStateToProps(state) {
  return {
    graph: state.eliminationGraph.graph,
    networkName: state.graph.networkFile,
    algo: state.activeAlgo
  };
}

type Props = {
  networkName: string,
  toMoralized: () => void,
  algo: string,
  eliminateNode: () => void,
  findNextElimination: () => void,
  graph: Object
};

class Unit4Component extends Component<Props> {

  state = {
    chosenNode: null
  };

  handleNodeChosen(node) {
    const chosenNode = node.nodes[0];
    this.setState({
      chosenNode
    });
  }

  render() {
    const {networkName, toMoralized: toMoralized1, algo} = this.props;
    const {eliminateNode: eliminateNode1, graph, findNextElimination: findNextElimination1} = this.props;
    const {chosenNode} = this.state;
    return (
      <div style={{width: '100%'}}>
        <RaisedButton label="Convert to moralized" style={style}
                      onClick={() => toMoralized1(networkName, algo.id)}/>
        <RaisedButton label="Eliminate Node" style={style}
                      onClick={() => eliminateNode1(chosenNode, graph)}/>
        <RaisedButton label="Find Perfect Elimination" style={style}
                      onClick={() => findNextElimination1(graph)}/>
        <EliminationGraphComponent handleNode={this.handleNodeChosen.bind(this)}/>
        <BinaryMembership/>
      </div>
    );
  }
}

const Unit4ComponentObj = connect(mapStateToProps, mapDispatchToProps)(Unit4Component);
export default Unit4ComponentObj;
