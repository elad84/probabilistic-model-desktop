import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { RaisedButton } from 'material-ui';
import { bindActionCreators } from 'redux';
import {
  checkDependency,
  handleRootChosen,
  resetDependencyGraph,
  setObserved
} from '../actions/dependencyGraph';
import DependencyGraphComponent from '../components/unit1/DependencyGraph';
import ConnectedObservedDialog from '../components/unit1/ObservedDialog';

const style = {
  margin: 12
};
const graphStyle = {
  height: '400px',
  border: '1px solid gray'
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkDependency,
      chooseAllObserved: setObserved,
      resetDependencyGraph,
      handleRootChosen
    },
    dispatch
  );

function mapStateToProps(state) {
  return {
    graph: state.graphData.dependencyGraph,
    networkName: state.graphData.networkFile,
    algo: state.activeAlgo,
    nodes: state.graphData.nodes,
    nodesMap: state.graphData.nodesMap,
    networkType: state.graphData.networkType,
    layersCount: state.graphData.layersCount
  };
}

type Props = {
  networkName: string,
  nodes: Array,
  networkType: string,
  nodesMap: Object,
  layersCount: number,
  graph: Object,
  checkDependency: () => void,
  chooseAllObserved: () => void,
  resetDependencyGraph: () => void,
  handleRootChosen: () => void
};

class Unit1Container extends Component<Props> {
  state = {
    chosenNode: null,
    observedNodes: [],
    dialogOpen: false,
    // runGuide : false,
    // eslint-disable-next-line react/no-unused-state
    stepIndex: 0,
    steps: [
      {
        target: '.graph',
        content:
          'Please click on "Estimation" so it will be chosen as root node',
        disableBeacon: true,
        spotlightClicks: true
      },
      {
        target: '.choose-observed',
        content: 'Choose the observed node "Project Release"',
        disableBeacon: true,
        spotlightClicks: true
      },
      {
        target: '.check-dependency',
        content:
          'Click this button when you are ready to see which nodes are depended or independent from "Estimation" given that "Project Release" is observed',
        disableBeacon: true,
        spotlightClicks: true
      }
    ]
  };

  componentDidMount() {
    const { networkName } = this.props;
    if (networkName === 'example1.txt') {
      this.setState({
        // runGuide: true
      });
    }
  }

  handleJoyrideCallback(event) {
    if (event.type === 'step:after' && event.index === 0) {
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        stepIndex: event.index
      });
      const { steps: steps1 } = this.state;
      const steps = Array.from(steps1);
      steps.push({
        target: '.graph',
        content: 'Now you can see that',
        disableBeacon: true
      });
      this.setState({
        steps
      });
      // Do your sync things, at the end of which do another setState to turn `runGuide` back to `true`
    } else if (event.type === 'step:after') {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ stepIndex: event.index });
    }
  }

  // observed dialog functions
  setObserved(observedNodes) {
    this.setState({
      observedNodes
      // runGuide : true
    });

    const { chooseAllObserved } = this.props;
    chooseAllObserved(observedNodes);
  }

  reset() {
    // eslint-disable-next-line no-shadow
    const { resetDependencyGraph } = this.props;
    this.setState({
      observedNodes: []
    });

    resetDependencyGraph();
  }

  closeDialog() {
    this.setState({ dialogOpen: false });
  }

  chooseObserved() {
    this.setState({
      dialogOpen: true
      // runGuide : false
    });
  }

  handleNodeChosen(node) {
    const chosenNode = node.nodes[0];
    this.setState({
      chosenNode
    });
    const { observedNodes } = this.state;
    // eslint-disable-next-line no-shadow
    const {
      handleRootChosen,
      networkName,
      nodes,
      networkType,
      checkDependency: checkDependency1,
      nodesMap,
      layersCount,
      graph
    } = this.props;
    handleRootChosen(chosenNode);
    checkDependency1(
      chosenNode,
      observedNodes,
      graph,
      nodes,
      nodesMap,
      networkName,
      networkType,
      layersCount
    );
  }

  render() {
    const { chosenNode, dialogOpen, observedNodes } = this.state;
    const { graph } = this.props;
    if (!graph) {
      return <Redirect to="/" />;
    }

    const qualifiedObserved = Array.from(graph.nodes);
    if (chosenNode) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < qualifiedObserved.length; i++) {
        if (qualifiedObserved[i].id === chosenNode) {
          qualifiedObserved.splice(i, 1);
          break;
        }
      }
    }
    return (
      <div style={{ width: '100%' }}>
        <ConnectedObservedDialog
          closeCallback={this.closeDialog.bind(this)}
          open={dialogOpen}
          nodesList={qualifiedObserved}
          observedNodes={observedNodes}
          setObserved={this.setObserved.bind(this)}
        />
        <div className="dependency-explanation">
          Please set a set of observed nodes and then click on non observed node
          to find which nodes are conditional independent from chosen node. On
          every click on node the conditional dependency will be recalculated.
          <br />
          Root node is highlighted in{' '}
          <span style={{ color: '#32a84a' }}>green</span>
          <br />
          Observed nodes is highlighted in{' '}
          <span style={{ color: '#a9a9a9' }}>gray</span>
          <br />
          Nodes that are conditional dependent in root node will be highlighted
          in <span style={{ color: '#00FF00' }}>light green</span>
        </div>
        <div className="dependency-buttons">
          <div className="observed-wrapper">
            <RaisedButton
              className="choose-observed"
              label="Choose Observed Node"
              style={style}
              onClick={this.chooseObserved.bind(this)}
            />
            <div className="observed-counter">({observedNodes.length})</div>
          </div>

          {/* <RaisedButton className="check-dependency" label="Check Dependency" style={style} */}
          {/*              onClick={() => checkDependency1(chosenNode, observedNodes, */}
          {/*                graph, nodes, nodesMap, networkName, networkType, layersCount)}/> */}
          <RaisedButton
            className="reset"
            label="Reset Network"
            style={style}
            onClick={() => this.reset()}
          />
        </div>
        <div style={graphStyle} className="graph">
          <DependencyGraphComponent
            handleNode={this.handleNodeChosen.bind(this)}
          />
        </div>
      </div>
    );
  }
}

const Unit1ContainerObj = connect(
  mapStateToProps,
  mapDispatchToProps
)(Unit1Container);
export default Unit1ContainerObj;
