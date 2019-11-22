import Graph from 'react-graph-vis';
import React, {Component} from 'react';

const options = {
  width: '100%',
  edges: {
    color: "#000000"
  },
};

type Props = {
  graph: Object
};

export default class ChordalGraphComponent extends Component<Props> {
  props;

  render() {
    const {graph} = this.props;
    return (<Graph graph={graph} options={options} />);
  }
}

