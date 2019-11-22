// @flow
import axios from "axios";
import type {Action} from './types';
import {toBayesianNetwork} from "./graph";
import {ADD_CONTROL_NODE, ADD_NODE, CREATE_GRAPH, DELETE_NODE, SAVE_GRAPH, SET_DETAILS} from "../actions/EditNetwork";
import {LOAD_NETWORK} from "../actions/graph";
import {CHOOSE_OBSERVED, DEPENDENCY_RESPONSE, RESET_GRAPH, ROOT_CHOSEN, TO_MORALIZED} from "../actions/dependencyGraph";
import {ELIMINATE_NODE, ELIMINATE_PERFECT} from "../actions/eliminationGraph";
import {isBlank, isNotBlank} from "../utils/Util";
import {isNotEmptyArr} from "../utils/ArrayUtils";


const initialState = {
  graph: {
    nodes: [],
    edges: []
  },
  nodes: [],
  nodeMap: {},
  graphState: 'edit',
  dialogOpen: false,
  networkName: '',
  networkFile: '',
  networkType: 'GENERAL',
  layerCount: 1,
  unsaved: false
};

function validateNode(node) {
  const invalidFields = [];
  if (!node.id) {
    invalidFields.push('id');
  }

  if (isBlank(node.label)) {
    invalidFields.push('label');
  }

  if (!Array.isArray(node.domain)) {
    invalidFields.push('domain');
  }

  if (!Array.isArray(node.parents)) {
    invalidFields.push('parents');
  }

  return invalidFields;

}


function getNode(existingData, id, label, isControl = false, level = 1, color = '#41e0c9') {
  const node = {};
  if (existingData) {
    // Object.assign(node, existingData);
    node.id = existingData.nodeId;
    node.label = existingData.displayName;
    node.level = 1;
    node.color = color;
    node.parents = existingData.parentList || [];
    node.controlNode = existingData.controlNode;
    node.domain = existingData.domain;
    // construct with empty so can be filled later on
    node.reachableNodes = [];
  } else {
    const displayName = label || `Node${id}`;
    Object.assign(node,
      {
        id,
        label: displayName,
        color,
        parents: [],
        controlNode: isControl,
        displayName,
        domain: [],
        level,
        reachableNodes: []
      });
  }

  const errors = validateNode(node);
  if (isNotEmptyArr(errors)) {
    console.log(`got invalid node when creating it: ${JSON.stringify(errors)}`);
  }

  return node;
}

function resetGraph(action, state) {
  if (action.payload === 1) {
    return Object.assign(state, {dependencyGraph: state.graph});
  }
  if (action.payload === 2) {
    return Object.assign(state, {moralizeGraph: state.graph});
  }

  if (action.payload === 3) {
    return Object.assign(state, {eliminationGraph: state.graph});
  }
  return state;
}

function dependencyRootChosen(state, action) {
  const nextState = Object.assign({}, state);
  const {dependencyGraph} = state;
  const nodes = Array.from(dependencyGraph.nodes);
  let chosenNode;
  let node;
  for (let i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (node.id === action.payload) {
      chosenNode = Object.assign({}, node);
      // eslint-disable-next-line no-param-reassign
      chosenNode.color = '#004d26';
      nodes.splice(i, 1, chosenNode);
    } else if (node.color === '#004d26') {
      node = Object.assign({}, node);
      node.color = '#41e0c9';
      nodes.splice(i, 1, node);
    }
  }

  Object.assign(nextState, {
    dependencyGraph: {
      nodes,
      edges: dependencyGraph.edges
    },
    nodes
  });

  nextState.nodesMap[action.payload] = chosenNode;
  return nextState;
}

function dependencyObservedChosen(state, action) {
  if (!action.payload) {
    return state;
  }

  // create next state
  const nextState = Object.assign({}, state);

  // get nodes
  const {dependencyGraph} = state;
  const nodes = Array.from(dependencyGraph.nodes);
  const observed = action.payload;
  let node;
  for (let i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (observed.indexOf(node.id) > -1) {
      const chosenNode = Object.assign({}, node);
      // eslint-disable-next-line no-param-reassign
      chosenNode.color = '#a9a9a9';
      nodes.splice(i, 1, chosenNode);
    } else if (node.color === '#a9a9a9') {
      // if not found in observed and was before
      // set to default color
      node = Object.assign({}, node);
      node.color = '#41e0c9';
      nodes.splice(i, 1, node);
    }
  }

  Object.assign(nextState, {
    dependencyGraph: {
      nodes,
      edges: dependencyGraph.edges
    },
    nodes
  });

  return nextState;
}

export default function graphData(state: Object = initialState, action: Action) {
  let newState;
  switch (action.type) {
    case CREATE_GRAPH:
      return createGraph(state, action);
    case LOAD_NETWORK:
      newState = loadNetwork(state, action);
      return Object.assign(newState, {
        dependencyGraph: Object.assign({}, newState.graph),
        moralizedGraph: Object.assign({}, newState.graph),
        eliminationGraph: Object.assign({}, newState.graph)
      });
    case ADD_NODE:
      newState = addNode(state, action);
      return Object.assign(newState, {dependencyGraph: Object.assign({}, newState.graph)});
    case ADD_CONTROL_NODE:
      newState = addControlNode(state);
      return Object.assign(newState, {dependencyGraph: Object.assign({}, newState.graph)});
    case SAVE_GRAPH:
      return saveGraph(state, action);
    case SET_DETAILS:
      newState = setDetails(state, action);
      return Object.assign(newState, {dependencyGraph: Object.assign({}, newState.graph)});
    case "ALGO_SELECTED" :
      if (action.payload.id === 3) {
        return Object.assign(state, {eliminationGraph: state.graph});
      }

      if (action.payload.id === 2) {
        return Object.assign(state, {moralizeGraph: state.graph});
      }
      if (action.payload.id === 1) {
        return Object.assign(state, {dependencyGraph: state.graph});
      }
      return state;
    case TO_MORALIZED :
      if (action.payload.activeUnit === 3) {
        return toMoralizedElimination(state, action);
      } else if (action.payload.activeUnit === 2) {
        return toMoralizedDependency(state, action);
      }
      return state;
    case ELIMINATE_NODE:
      return eliminateNode(state, action);
    case DEPENDENCY_RESPONSE:
      return dependencyResponse(state, action);
    case RESET_GRAPH:
      return resetGraph(action, state);
    case ELIMINATE_PERFECT:
      console.log(JSON.stringify(action));
      return state;
    case DELETE_NODE:
      return deleteNode(state, action);
    case ROOT_CHOSEN:
      return dependencyRootChosen(state, action);
    case CHOOSE_OBSERVED:
      return dependencyObservedChosen(state, action);
    default:
      return state;
  }
}

/**
 * Deletes a node from the network
 *
 * To remove a node need to remove it from:
 * 1. node list
 * 2. parent list of other nodes
 * 3. edge list
 *
 * @param state
 * @param action
 * @returns {any}
 */
function deleteNode(state, action) {
  const {nodeId} = action;
  const nextState = Object.assign({}, state);
  // get current graph
  const {graph} = state;

  const nodes = Array.from(graph.nodes);
  let node;
  let index;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (nodeId === node.id) {
      index = i;
    } else {
      // not the node so could be that
      // the node is in the parent list
      const parentIndex = node.parents.indexOf(nodeId);
      if (parentIndex > -1) {
        // remove from parent list
        node.parents.splice(parentIndex, 1);
      }
      // need to remove the node from the reachable node list
      const reachableIndex = node.reachableNodes.indexOf(nodeId);
      if(reachableIndex > -1) {
        node.reachableNodes.splice(reachableIndex, 1);
      }
    }
  }

  if (node !== null) {
    nodes.splice(index, 1);
  }

  // set node parents
  let edges = Array.from(graph.edges);
  edges = edges.filter((value) => value.from !== nodeId && value.to !== nodeId);

  // if(removeEdges.length > 0) {
  //   edges = edges.filter((value, index))
  //   edges.forEach(removedEdgeIndex => edges.splice(removedEdgeIndex, 1));
  // }

  const nodesMap = nodes.reduce((map, n) => {
    // eslint-disable-next-line no-param-reassign
    map[n.id] = n;
    return map;
  }, {});

  nodes.forEach(n => {
    addReachable(n.id, nodesMap, n.parents);
  });

  Object.assign(nextState, {
    graph: {
      nodes,
      edges
    },
    "nodes": nodes,
    unsaved: true,
    nodesMap
  });

  return nextState;
}

function loadNetwork(state, action) {
  const nextState = Object.assign({}, state);
  const {networkName, networkFile, type, nodes, edges} = action.payload;
  const loadedNodes = Array.from(nodes, node => getNode(node, null, null, null, null, node.controlNode === true ? '#6aa34e' : '#41e0c9'));

  // eslint-disable-next-line no-plusplus,promise/always-return
  const loadedEdges = Array.from(edges, edge => {
    return {from: edge.nodeArrowHead, to: edge.nodeId2};
  });

  const nodesMap = loadedNodes.reduce((map, node) => {
    // eslint-disable-next-line no-param-reassign
    map[node.id] = node;
    return map;
  }, {});

  loadedNodes.forEach(node => {
    addReachable(node.id, nodesMap, node.parents);
  });

  return Object.assign(nextState, {
    type,
    networkName,
    networkFile,
    graph: {
      nodes: loadedNodes,
      edges: loadedEdges
    },
    nodes: loadedNodes,
    nodesMap
  });
}

function dependencyResponse(state, action) {
  const {edges: allEdges, observed, rootNode, nodes: responseNodes} = action.payload;
  const nextState = Object.assign({}, state);
  const {dependencyGraph} = state;

  // set node parents
  const edges = Array.from(dependencyGraph.edges);
  const dependentNodes = [];

  const newEdges = Array.from(allEdges, (edge) => {
    const edgeColor = getEdgeColor(edge.category);
    // if(edgeColor !== 'black' ) {
    //   if(observed.indexOf(edge.nodeId1) === -1 && rootNode !== edge.nodeId1) {
    //     dependentNodes.push(edge.nodeId1);
    //   }
    //
    //   if(observed.indexOf(edge.nodeId2) === -1 && rootNode !== edge.nodeId2) {
    //     dependentNodes.push(edge.nodeId2);
    //   }
    // }
    return {from: edge.nodeId1, to: edge.nodeId2, color: {color: edgeColor, highlight: edgeColor}, width: 3};
  });

  responseNodes.forEach(node => {
    if (node.nodeId !== rootNode && observed.indexOf(node.nodeId) === -1 && node.visited === true) {
      dependentNodes.push(node.nodeId);
    }
  });

  const nodes = Array.from(dependencyGraph.nodes);
  if (dependentNodes.length > 0) {
    nodes.forEach((value, index) => {
      if (dependentNodes.indexOf(value.id) > -1) {
        const newNode = Object.assign({}, value);
        newNode.color = '#00FF00';
        nodes.splice(index, 1, newNode);
      }
    });
  }

  Object.assign(nextState, {
    dependencyGraph: {
      nodes,
      edges: newEdges
    },
    nonDependentEdges: edges
  });

  return nextState;
}

function getEdgeColor(dependencyType) {
  switch (dependencyType) {
    case "BLOCKED_COLLIDER" :
      return '#FF0000';
    case "BLOCKED_NON_COLLIDER":
      return '#0000FF';
    case "CONNECTED":
      return '#008000';
    default:
      return 'black';
  }
}

function arrayUnique(array) {
  const a = array.concat();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < a.length; ++i) {
    // eslint-disable-next-line no-plusplus
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
      // eslint-disable-next-line no-plusplus
        a.splice(j--, 1);
    }
  }

  return a;
}

function addReachable(nodeId, nodesMap, parents) {
  if (isNotEmptyArr(parents)) {
    parents.forEach(parent => {
      // push myself to the reachable nodes
      nodesMap[parent].reachableNodes.push(nodeId);
      // add the nodes that I can reach
      // eslint-disable-next-line no-param-reassign
      nodesMap[parent].reachableNodes = arrayUnique(nodesMap[parent].reachableNodes.concat(nodesMap[nodeId].reachableNodes));
      addReachable(nodeId, nodesMap, nodesMap[parent].parents);
    });
  }
}

function isReachable(nodeId, nodesMap, parents) {
  if (isNotEmptyArr(parents)) {
    if(parents.indexOf(nodeId) > -1) {
      return true;
    }
    for(let i = 0; i < parents.length; i++) {
       return isReachable(nodeId, nodesMap, nodesMap[parents[i]].parents);
    }
  }
  return false;
}

function removeReachable(nodeId, nodesMap, parents) {
  if (isNotEmptyArr(parents)) {
    parents.forEach(parent => {
      const index = nodesMap[parent].reachableNodes.indexOf(nodeId);
      if(index > -1) {
        nodesMap[parent].reachableNodes.splice(index, 1);
      }

      // check if node reachable nodes are reached to parent
      // through another path
      nodesMap[nodeId].reachableNodes.forEach(reachableNode => {
          if(!isReachable(parent, nodesMap, nodesMap[reachableNode].parents)) {
            const reachableIndex = nodesMap[parent].reachableNodes.indexOf(reachableNode);
            if(reachableIndex > -1) {
              nodesMap[parent].reachableNodes.splice(reachableIndex, 1);
            }
          }
      });
      removeReachable(nodeId, nodesMap, nodesMap[parent].parents);
    });
  }
}


function setDetails(state, action) {
  const {nodeId, nodeLabel, nodeDomain, parents} = action.payload;
  const nextState = Object.assign({}, state);
  const {graph, nodes} = state;

  const nextStateNodes = nodes.reduce((map, node) => {
    // eslint-disable-next-line no-param-reassign
    map[node.id] = node;
    return map;
  }, {});

  const node = nextStateNodes[nodeId];

  if (!node) {
    // node not found, nothing to do
    return nextState;
  }

  // create a copy of the nodes and the nodes
  // const newNodes = Array.from(nodes);
  const copy = Object.assign({}, node);

  // set node label
  if (isNotBlank(nodeLabel)) {
    copy.label = nodeLabel;
    // nodesMap[nodeId].label = nodeLabel;
  }

  // assign parent no matter what since also empty array is fine
  copy.parents = parents || [];

  // set node domain
  copy.domain = nodeDomain;
  // nodesMap[nodeId].domain = nodeDomain;

  // add to the list of nodes
  // newNodes.splice(index, 1, copy);

  // set node parents
  let edges = Array.from(graph.edges);

  const existingEdges = Array.from(edges, edge => `${edge.from}_${edge.to}`);

  // remove edges if removed by the new parent list
  const removedIndexes = [];
  const removedParents = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].to === nodeId && (!parents || parents.indexOf(edges[i].from) === -1)) {
      removedIndexes.push(i);
      removedParents.push(edges[i].from);
    }
  }

  // first remove unnecessary edges
  removedIndexes.forEach(index => edges.splice(index, 1));

  // add new edges
  if (parents) {
    parents.forEach(parent => {
      if (existingEdges.indexOf(`${parent}_${nodeId}`) === -1) {
        // add edge only if not exist
        edges = edges.concat({from: parent, to: nodeId});
      }
    });
  }

  nextStateNodes[nodeId] = copy;

  addReachable(nodeId, nextStateNodes, parents);
  removeReachable(nodeId, nextStateNodes, removedParents);

  const newNodes = Object.values(nextStateNodes);

  Object.assign(nextState, {
    graph: {
      nodes: newNodes,
      edges
    },
    nodes: newNodes,
    nodesMap: nextStateNodes,
    unsaved: true
  });

  return nextState;
}

function saveGraph(state, action) {
  let name = action.fileName || state.networkName;
  const {networkName} = state;
  const bayesianNetwork = toBayesianNetwork(state.graph, state.nodes, state.nodesMap, networkName, state.networkType, state.layersCount);

  if (!name.endsWith(".json")) {
    name += ".json";
  }

  const bayesian = {
    "filePath": name,
    "network": bayesianNetwork
  };

  axios.post('http://localhost:8080/bayesian/network/create', bayesian)
    .then(response => {
      if (response.status === 200) {
        alert(`Saved Successfully as ${name}`);
      } else {
        alert("Failed to save network");
      }
      return true;
    }).catch(reason => console.log(reason));

  const newState = Object.assign({}, state);
  return Object.assign(newState, {
    networkFile: bayesian.filePath,
    unsaved: false
  });
}


function createGraph(state, action) {
  const nextState = Object.assign({}, state);

  let count = action.nodeCount;
  // eslint-disable-next-line no-plusplus
  count++;

  const nodes = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < count; i++) {
    const newNode = getNode(null, i, false);
    nodes.push(newNode);
  }

  const networkNodes = nodes.slice();

  if (action.networkType === 'ITERATIVE') {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < count; i++) {
      const anotherLevelNode = getNode(null, i + count, `Node${i}(i-1)`, false, 2, '#175ed1');
      networkNodes.push(anotherLevelNode);
    }

    // Object.assign(nextState, {
    //   addControlButtonStyle: {
    //     margin: 12,
    //     display: "inline-block"
    //   }
    // });
  }

  const nodesMapping = {};
  nodes.map((node) => {
    nodesMapping[node.id] = node;
    return node;
  });


  Object.assign(nextState, {
    graph: {
      nodes: networkNodes,
      edges: []
    },
    nodesMap: nodesMapping,
    nodes,
    networkName: action.networkName,
    // saveNetworkStyle: {
    //   margin: 12,
    //   display: "inline-block"
    // },
    // addNodeStyle: {
    //   margin: 12,
    //   display: "inline-block"
    // },
    networkType: action.networkType,
    layerCount: action.networkType === 'ITERATIVE' ? action.layerCount : 1,
    dependencyGraph: Object.assign({}, nextState.graph),
    networkFile: '',
    unsaved: true
  });
  return nextState;
}

function addNode(state) {
  const nextState = Object.assign({}, state);
  const {graph} = state;
  let {nodes, nodesMap} = state;
  let graphNodes = graph.nodes;


  // find next available id
  let id = 1;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nodes.length; i++) {
    if (id < nodes[i].id) {
      // eslint-disable-next-line prefer-destructuring
      id = nodes[i].id;
    }
  }
  // eslint-disable-next-line no-plusplus
  id++;

  const node = getNode(null, id);

  // add node to all necessary places
  graphNodes = graphNodes.concat(node);
  nodes = nodes.concat(node);
  nodesMap[id] = node;

  if (state.networkType === 2) {
    graphNodes.push(getNode(null, id + nodes, `Node${id}(i-1)`, false, 2, '#175ed1'));
  }


  Object.assign(nextState, {
    graph: {
      nodes: graphNodes,
      edges: graph.edges
    },
    nodes,
    nodesMap,
    unsaved: true
  });

  return nextState;
}

function addControlNode(state) {
  const nextState = Object.assign({}, state);
  const {graph, nodes, nodesMap} = state;
  const graphNodes = graph.nodes;

  if (nodes.length === 0) {
    alert("Cannot add control node to an empty network");
    return;
  }

  let id = 'c0';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].control === true && id < parseInt(nodes[i].id.substring(1), 10)) {
      // eslint-disable-next-line prefer-destructuring
      id = nodes[i].id;
    }
  }

  let intId = parseInt(id.substring(1), 10);
  // eslint-disable-next-line no-plusplus
  intId++;

  const newNodeId = `c${intId}`;

  const node = getNode(null, newNodeId, `Control Node${intId}`, true, 1, '#6aa34e');
  // const node = {id: newNodeId, label: `Control Node${intId}`, color: '#6aa34e', control: true};
  nodesMap[newNodeId] = node;

  Object.assign(nextState, {
    graph: {
      nodes: graphNodes.concat(node),
      edges: graph.edges
    },
    nodes: nodes.concat(node),
    nodesMap,
    unsaved: true
  });

  return nextState;
}

function getMoralizeData(action, state) {
  const moralizedEdges = action.payload.newEdges;
  const nextState = Object.assign({}, state);

  const newEdges = Array.from(moralizedEdges, (edge) => {
    const tuple = edge.split("_");
    return {from: tuple[0], to: tuple[1], "arrows": '', color: tuple.length > 2 ? 'red' : '#848484'};
  });
  return {nextState, newEdges};
}

function toMoralizedDependency(state, action) {
  const {nextState, newEdges} = getMoralizeData(action, state);

  Object.assign(nextState, {
    moralizeGraph: {
      nodes: nextState.graph.nodes,
      edges: newEdges
    }
  });

  return nextState;
}

function toMoralizedElimination(state, action) {
  const {nextState, newEdges} = getMoralizeData(action, state);

  Object.assign(nextState, {
    eliminationGraph: {
      nodes: nextState.graph.nodes,
      edges: newEdges
    }
  });

  return nextState;
}

function eliminateNode(state, action) {
  const graph = action.payload.nodeEdge;

  const nextState = Object.assign({}, state);
  const {eliminationGraph} = state;
  const map = {};
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < eliminationGraph.nodes.length; i++) {
    map[eliminationGraph.nodes[i].id] = eliminationGraph.nodes[i];
  }

  const newEdges = [];
  const newNodes = [];
  for (let [key, value] of Object.entries(graph)) {
    newNodes.push(map[key]);
    value.forEach(edge => newEdges.push({from: edge.nodeId1, to: edge.nodeId2, "arrows": ''}))
  }

  // Object.values(map).forEach(index => {
  //   eliminationGraph.nodes.splice(index, 1);
  // });


  Object.assign(nextState, {
    eliminationGraph: {
      nodes: newNodes,
      edges: newEdges
    }
  });

  return nextState;

}
