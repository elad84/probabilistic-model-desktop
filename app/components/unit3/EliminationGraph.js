import Graph from 'react-graph-vis';
import React, {Component} from 'react';

const options = {
  width: '100%',
  height: '500px',
  layout: {
    improvedLayout: true
  },
  edges: {
    color: "#000000"
  }
};
const graphStyle = {
  height: "400px",
  border: "1px solid gray"
};

type Props = {
  graph: Object,
  handleNode: () => void
};

export default class EliminationGraphComponent extends Component<Props> {
  render() {
    const {graph, handleNode} = this.props;
    return (
      <div style={graphStyle}><Graph graph={graph} options={options} events={{click: handleNode}}/></div>
    );
  }
}
