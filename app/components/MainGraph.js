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
  graph: Object
};

class MainGraph extends Component<Props>{

  props: Props;

  nodeChosen(node) {
    const chosenNode = node.nodes[0];
    this.setState({
      chosenNode
    });
  }

  render(){
    const {graph} = this.props;
    console.log(`render graph: ${JSON.stringify(graph)}`);
    return (<Graph graph={graph} options={options} />);
  }
}

const mapStateToProps = state => ({
  graph: state.graphData.graph
});

export default connect(mapStateToProps , null)(MainGraph);
