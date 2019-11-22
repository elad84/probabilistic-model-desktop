import Graph from 'react-graph-vis';
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {handleAddNode} from "../actions/EditNetwork";

const options = {
  width: '100%',
  edges: {
    color: "#000000"
  },
};

type Props = {
  graph: Object,
  handleNode: () => void
};

class GraphComponent extends Component<Props> {
  props;

  render() {
    const {handleNode, graph} = this.props;
    return (<Graph graph={graph} options={options} events={{click: handleNode}}/>);
  }
}

const mapStateToProps = state => ({
  graph: state.graphData.graph,
  graphState: state.graphState
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({handleNodeClick: handleAddNode}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);
