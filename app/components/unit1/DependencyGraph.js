import Graph from 'react-graph-vis';
import React, {Component} from 'react';
import {connect} from "react-redux";

const options = {
  width : '100%',
  height: '500px',
  layout: {
    improvedLayout: true
  },
  edges: {
    color: "#000000"
  }
};

type Props = {
  graph: Object,
  handleNode: () => void
};

class DependencyGraphComponent extends Component<Props>{

  state = {
    // eslint-disable-next-line react/no-unused-state
    rootNode : null
  };

  nodeChosen(node) {
    const chosenNode = node.nodes[0];
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      chosenNode
    });
  }

  render(){
    const {handleNode, graph} = this.props;
    return (<Graph graph={graph} options={options} events={{click: handleNode}} />);
  }
}

const mapStateToProps = state => ({
  graph: state.graphData.dependencyGraph
});

export default connect(mapStateToProps, null)(DependencyGraphComponent);
