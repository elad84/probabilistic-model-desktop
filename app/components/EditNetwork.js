import React, { Component } from 'react';
import { remote } from 'electron';
import axios from 'axios';
import { Prompt } from 'react-router';
import { RaisedButton, TextField } from 'material-ui';
import { isEmptyArr, isNotEmptyArr } from '../utils/ArrayUtils';
import NavigationBar from './NavigationBar';
import NodeDialog from './NodeDialog';
import GraphComponent from './GraphComponent';
import { isNotBlank } from '../utils/Util';

const addNodeStyle = {
  margin: 12
  // display: "none"
};
const addControlButtonStyle = {
  margin: 12
  // display: "none"
};
const graphStyle = {
  height: '400px',
  border: '1px solid gray'
};

type Props = {
  graph: () => Object,
  nodes: () => array,
  nodesMap: Object,
  addControlNode: () => func,
  handleAddNode: () => func,
  saveGraph: () => func,
  unsaved: boolean,
  networkType: string,
  addControlNode: () => void,
  networkName: string,
  networkFile: string,
  loadNetwork: () => void,
  deleteNode: () => void,
  setNodeDetails: Function,
  dataUnsaved: boolean
};

function domainStr2Array(rangeStr) {
  const domain = [];
  let range;
  if (isNotBlank(rangeStr)) {
    if (rangeStr.indexOf(',') > 0) {
      // have range as label
      range = rangeStr.split(',');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < range.length; ++i) {
        domain.push({ name: range[i].trim() });
      }
      // set the value for all names starting at zero
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < domain.length; i++) {
        domain[i].value = i;
      }
    } else {
      range = rangeStr.split('-');
      // set the lower value to the first value
      const lower = parseInt(range[0], 10);
      if (domain[0] === undefined) {
        domain[0] = { value: lower };
      } else {
        domain[0].value = lower;
      }

      if (range.length > 1) {
        // iterate until higher bound and set all values
        // eslint-disable-next-line no-plusplus
        for (let i = lower + 1, j = 1; i <= parseInt(range[1], 10); i++, j++) {
          if (domain[j] === undefined) {
            domain[j] = { value: i };
          } else {
            domain[j].value = i;
          }
        }
      }
    }
  }

  return domain;
}

export default class EditNetwork extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      chosenNodeDomain: '',
      chosenNodeLabel: '',
      chosenNodeParents: [],
      chosenNode: null,
      networkName: props.networkName
    };

    this.handleNodeChosen = this.handleNodeChosen.bind(this);
  }

  state = {
    chosenNodeDomain: '',
    chosenNodeLabel: '',
    chosenNodeParents: [],
    chosenNodePotentialParents: []
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this.beforeunload.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload.bind(this));
  }

  beforeunload(e) {
    const { dataUnsaved } = this.props;
    if (dataUnsaved) {
      e.preventDefault();
      e.returnValue = true;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  openFolderChooser() {
    return axios.get('http://localhost:8080/general/choose');
  }

  handleNodeChosen(node) {
    if (isEmptyArr(node.nodes)) {
      return;
    }
    const chosenNodeId = node.nodes[0];
    // reset values first
    this.setState({
      chosenNode: chosenNodeId,
      chosenNodeDomain: '',
      chosenNodeLabel: '',
      chosenNodeParents: [],
      nodeLabelExists: false
    });

    const { graph, nodesMap } = this.props;

    const graphNodes = graph.nodes;
    const { label, parents: nodeParents } = nodesMap[chosenNodeId];

    const { reachableNodes } = nodesMap[chosenNodeId];

    const currentList = graphNodes.filter(graphNode => {
      const parents = graphNode.parents || [];
      return (
        graphNode.id !== chosenNodeId &&
        parents.indexOf(chosenNodeId) === -1 &&
        reachableNodes.indexOf(graphNode.id) === -1
      );
    });

    const { domain } = nodesMap[chosenNodeId];
    if (isNotEmptyArr(domain)) {
      let domainValue = '';
      if (domain[0].name) {
        domain.forEach(name => {
          if (domainValue !== '') {
            domainValue += ',';
          }
          domainValue += name.name;
        });
      } else {
        domainValue = `${domain[0].value}-${domain[domain.length - 1].value}`;
      }
      this.setState({
        chosenNodeDomain: domainValue
      });
    }

    this.setState({
      dialogOpen: true,
      chosenNodePotentialParents: currentList,
      chosenNodeLabel: label,
      chosenNodeParents: nodeParents
    });
  }

  closeDialog() {
    this.setState({ dialogOpen: false });
  }

  deleteNodeEdit(nodeId) {
    const { deleteNode } = this.props;
    this.setState({ dialogOpen: false });
    deleteNode(nodeId);
  }

  changeLabel(value) {
    const { nodes } = this.props;
    const { chosenNode } = this.state;
    let exist = false;
    nodes.forEach(node => {
      if (node.id !== chosenNode && node.label === value) {
        exist = true;
      }
    });
    this.setState({
      chosenNodeLabel: value,
      nodeLabelExists: exist
    });
  }

  changeParents(event, index, values) {
    this.setState({
      chosenNodeParents: values
    });
  }

  changeDomain(value) {
    this.setState({
      chosenNodeDomain: value
    });
  }

  saveAs() {
    const { networkName } = this.state;
    remote.dialog.showSaveDialog(
      null,
      {
        // properties: ['openFile'],
        title: 'Save Network'
      },
      result => {
        if (!result) {
          return;
        }
        const { saveGraph } = this.props;
        saveGraph(result, networkName);
      }
    );
  }

  save() {
    const { networkName } = this.state;
    const { networkFile } = this.props;
    if (networkFile) {
      const { saveGraph } = this.props;
      saveGraph(networkFile, networkName);
    } else {
      remote.dialog.showSaveDialog(
        null,
        {
          // properties: ['openFile'],
          title: 'Save Network'
        },
        result => {
          if (!result) {
            return;
          }
          const { saveGraph } = this.props;
          saveGraph(result, networkName);
        }
      );
    }
  }

  loadNetwork(history) {
    remote.dialog.showOpenDialog(
      {
        properties: ['openFile']
      },
      result => {
        if (!result) {
          return;
        }
        const { loadNetwork: loadNetwork1 } = this.props;
        loadNetwork1(result[0], history);
      }
    );
  }

  setNodeDetails() {
    const {
      chosenNodeDomain,
      chosenNodeLabel,
      chosenNodeParents,
      chosenNode
    } = this.state;
    // set node range
    const domain = domainStr2Array(chosenNodeDomain);

    const { setNodeDetails: setNodeDetails1 } = this.props;
    setNodeDetails1(chosenNode, chosenNodeLabel, domain, chosenNodeParents);
    this.closeDialog();
  }

  changeNetworkName(e) {
    this.setState({
      networkName: e.target.value
    });
  }

  render() {
    const {
      handleAddNode,
      networkType,
      addControlNode,
      graph,
      unsaved
    } = this.props;
    const {
      chosenNodePotentialParents,
      dialogOpen,
      chosenNodeDomain,
      chosenNode,
      chosenNodeLabel,
      chosenNodeParents,
      nodeLabelExists,
      networkName
    } = this.state;

    const graphDetails = graph.graph;

    const controlNodeButton =
      networkType === 'ITERATIVE' ? (
        <RaisedButton
          label="Add Control Node"
          style={addControlButtonStyle}
          onClick={() => addControlNode()}
        />
      ) : null;

    return (
      <div>
        <Prompt
          when={unsaved}
          message="Are you sure you want leave the edit without saving the network?"
        />
        <NavigationBar loadNetwork={this.loadNetwork.bind(this)} />
        <div>
          {/* <div>Network Files Folder: {folderPath}</div> */}
          <div>
            <TextField
              floatingLabelText="Graph Name"
              defaultValue={networkName}
              onChange={this.changeNetworkName.bind(this)}
            />
          </div>
          <RaisedButton
            label="Add New Node"
            style={addNodeStyle}
            onClick={() => handleAddNode()}
          />
          {controlNodeButton}
          <RaisedButton
            label="Save Network"
            style={addControlButtonStyle}
            onClick={
              () => this.save() /* saveGraph(this.refs.fileName.getValue()) */
            }
          />
          <RaisedButton
            label="Save As"
            style={addControlButtonStyle}
            onClick={
              () => this.saveAs() /* saveGraph(this.refs.fileName.getValue()) */
            }
          />
        </div>

        <div style={graphStyle}>
          <GraphComponent handleNode={this.handleNodeChosen.bind(this)} />
        </div>
        <NodeDialog
          closeCallback={this.closeDialog.bind(this)}
          open={dialogOpen}
          nodesList={chosenNodePotentialParents || []}
          nodeParents={chosenNodeParents}
          nodeDomain={chosenNodeDomain}
          nodeLabel={chosenNodeLabel}
          chosenNode={chosenNode}
          nodeLabelExists={nodeLabelExists}
          labelChanged={this.changeLabel.bind(this)}
          domainChanged={this.changeDomain.bind(this)}
          parentChanged={this.changeParents.bind(this)}
          deleteNode={this.deleteNodeEdit.bind(this)}
          setNodeDetails={this.setNodeDetails.bind(this)}
          graph={graphDetails}
        />
      </div>
    );
  }
}
