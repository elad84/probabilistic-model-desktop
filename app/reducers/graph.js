const CREATE_GRAPH = "CREATE_GRAPH",
  ADD_NODE = "ADD_NODE",
  ADD_CONTROL_NODE = "ADD_CONTROL_NODE",
  NODE_CHOSEN = "NODE_CHOSEN";

const initialState = {
  graph : {
    nodes: [],
    edges: []
  },
  graphState : 'edit',
  dialogOpen : false
};

function createGraph(state, action){
  const nextState = Object.assign({}, state);
  const {graph} = state;

  let count = action.nodeCount;
  count++;

  const nodes = [];

  for (let i = 1; i < count; i++) {
    nodes.push({id: i, label: 'Node' + i, color: '#41e0c9', level: 1})
  }

  const networkNodes = nodes.slice();

  if (action.networkType === 'ITERATIVE') {
    for (let i = 1; i < count; i++) {
      networkNodes.push({id: i + count, label: 'Node' + i + "(i-1)", color: '#175ed1', original: false, level: 2});
    }

    Object.assign(nextState, {
      addControlButtonStyle: {
        margin: 12,
        display: "inline-block"
      }
    });
  }

  Object.assign(nextState, {
    graph: {
      graph,
      nodes: networkNodes,
      edges: []
    }
  });

  const nodesMapping = {};
  nodes.map((node) => {
    return nodesMapping[node.id] = node;
  });

  Object.assign(nextState, {
    nodesMap: nodesMapping,
    "nodes": nodes,
    networkName: action.networkName,
    saveNetworkStyle: {
      margin: 12,
      display: "inline-block"
    },
    addNodeStyle: {
      margin: 12,
      display: "inline-block"
    },
    networkType: action.networkType,
    layerCount: action.networkType === 'ITERATIVE' ? action.layerCount : 1,
    dependencyGraph : Object.assign({}, nextState.graph)
  });
  return nextState;
}

function addNode(state){
  const nextState = Object.assign({}, state);
  let {graph, nodes} = state;
  let graphNodes = graph.nodes;


  let id = 1;
  for (let i = 0; i < nodes.length; i++) {
    if (id < nodes[i].id) {
      id = nodes[i].id;
    }
  }

  id++;

  const node = {id: id, label: 'Node' + id, color: '#41e0c9'};
  graphNodes = graphNodes.concat(node);
  nodes = nodes.concat(node);

  if(state.networkType == 2){
    graphNodes.push({id: id+nodes.length, label: 'Node'+ id + "(i-1)", color: '#175ed1'});
  }


  Object.assign(nextState, {
    graph: {
      graph,
      nodes: graphNodes,
      edges: graph.edges
    },
    nodes: nodes
  });

  nextState.nodesMap[id] = node;
  return nextState;
}

function addControlNode(state) {
  const nextState = Object.assign({}, state);
  let {graph, nodes} = state;
  let graphNodes = graph.nodes;

  if (nodes.length == 0) {
    alert("Cannot add control node to an empty network");
    return;
  }

  let id = 'c0';
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].control == true && id < parseInt(nodes[i].id.substring(1), 10)) {
      id = nodes[i].id;
    }
  }

  let intId = parseInt(id.substring(1), 10);
  intId++;

  let newNodeId = 'c' + intId;

  let node = {id: newNodeId, label: 'Control Node' + intId, color: '#6aa34e', control: true};


  Object.assign(nextState, {
    graph: {
      graph,
      nodes: graphNodes.concat(node),
      edges: graph.edges
    },
    nodes: nodes.concat(node)
  });

  nextState.nodesMap[newNodeId] = node;

  return nextState;
}

function nodeChosen(state, action) {
  const nextState = Object.assign({}, state);

  const chosenNodeId = action.payload.node.nodes[0];
  Object.assign(nextState, {
    chosenNode : chosenNodeId
  });
  let node = nextState.nodesMap[chosenNodeId];

  const { graph } = state;

  const graphNodes = graph.nodes;
  const nodes = state.nodes;

  for(let i = 0; i < graphNodes.length; i++){
    if(graphNodes[i].id == node.id){
      graphNodes[i].color = {
        color : "black",
        "highlight" : "red"
      };
    }
  }

  Object.assign(nextState, {
    graph: {
      graph,
      nodes: graphNodes,
      edges: graph.edges
    },
    dialogOpen : true
  });
  const domain = nextState.nodesMap[chosenNodeId]['domain'];
  if(domain){
    Object.assign(nextState, {
      nodeValues :  domain.value ? domain.value : domain.name
    });
  }

  return nextState;
}

function setDetails(state, action) {
  const { nodeId, nodeLabel, nodeDomain, parents} = action.payload;
  const nextState = Object.assign({}, state);
  const { graph } = state;
  //set node label
  if(nodeLabel && nodeLabel !== ''){
    const nodes = graph.nodes;

    let node = null, index;
    for(let i =0; i < nodes.length; i++){
      if(nodeId === nodes[i].id){
        node = nodes[i];
        index = i;
      }
    }

    if(node !== null){
      let copy = Object.assign({}, node);
      copy.label = nodeLabel;
      nodes.splice(index, 1);
      nodes.push(copy);
    }

    Object.assign(nextState, {
      graph: {
        graph,
        nodes: nodes,
        edges: graph.edges
      },
      "nodes": nodes
    });
    nextState.nodesMap[nodeId]['label'] = nodeLabel;
  }

  //set node domain
  nextState.nodesMap[nodeId]['domain'] = nodeDomain;

  //set node parents
  let edges = Array.from(graph.edges);

  if(parents){
    parents.forEach(parent => {
      edges = edges.concat({from: parent, to: nodeId})
    });
  }

  Object.assign(nextState, {
    graph: {
      graph,
      nodes : nextState.graph.nodes,
      edges: edges
    }
  });

  return nextState;
}

function toUndirected() {
  const nextState = Object.assign({}, state);
  const { graph } = state;

  let edges = Array.from(graph.edges);

  if(parents){
    parents.forEach(parent => {
      edges = edges.concat({from: parent, to: nodeId})
    });
  }

  Object.assign(nextState, {
    graph: {
      graph,
      nodes : nextState.graph.nodes,
      edges: edges
    }
  });

  return nextState;
}

function toServerNode(node) {
  const {id, controlNode, label, domain, parents} = node;
  return {
    nodeId: id,
    controlNode,
    displayName: label,
    domain,
    parentList: parents
  }
}


export function toBayesianNetwork(graph, nodes, nodesMap, name, networkType, layersCount) {
  const {edges} = graph;
  const networkNodes = [];
  const networkEdges = [];
  let node;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nodes.length; i++) {
    node = nodes[i];
    networkNodes.push(toServerNode(node));
  }

  for (let i = 0; i < edges.length; i++) {
    networkEdges.push({"nodeId1": edges[i].from, "nodeId2": edges[i].to, "nodeArrowHead": edges[i].from});
  }

  const bayesianNetwork = {
    "name": name,
    "type": networkType,
    "nodes": networkNodes,
    "edges": networkEdges,
    "layersCount": layersCount
  };
  return bayesianNetwork;
}

function saveGraph(state, action) {
  const name = action.fileName || state.networkName;
  const bayesianNetwork = toBayesianNetwork(state.graph, state.nodes, state.nodesMap, name, state.networkType, state.layersCount);

  const bayesian = {
    "filePath": name + ".txt",
    "network": bayesianNetwork
  };

  axios.post('http://localhost:8080/bayesian/network/create', bayesian).then(response => {
    if(response.status === 200) {
      alert("Saved Successfully");
    }else{
      alert("Failed to save network");
    }
  });

  const newState = Object.assign({}, state);
  return Object.assign(newState, {
    networkFile: bayesian.filePath
  });
}

function loadNetwork(state, action) {
  return Object.assign({}, state, action.payload);
}

function toMoralized(state, action) {

  const moralizedEdges = action.payload.newEdges;
  const nextState = Object.assign({}, state);
  const { graph } = state;

  //set node parents
  let edges = Array.from(graph.edges);

  const newEdges = Array.from(moralizedEdges, (edge) => {
    const tuple = edge.split("_");
    return {from: tuple[0], to: tuple[1], "arrows" : '', color : tuple.length > 2 ? 'red' : '#848484'};
  });

  Object.assign(nextState, {
    graph: {
      graph,
      nodes : nextState.graph.nodes,
      edges: newEdges
    },
    nonMoralizedEdges: edges
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

function dependencyResponse(state, action) {
  const allEdges = action.payload.edges;
  const nextState = Object.assign({}, state);
  const { graph } = state.dependencyGraph;

  //set node parents
  let edges = Array.from(graph.edges);

  const newEdges = Array.from(allEdges, (edge) => {
    return {from: edge.nodeId1, to: edge.nodeId2, color : {color : getEdgeColor(edge.category), highlight : getEdgeColor(edge.category)}, width: 3};
  });

  Object.assign(nextState, {
    dependencyGraph: {
      graph,
      nodes : nextState.graph.nodes,
      edges: newEdges
    },
    nonDependentEdges: edges
  });

  return nextState;
}

function populateGraphData(state, action) {
  const folderPath = action.payload.folderPath;
  const nextState = Object.assign({}, state);
  Object.assign(nextState, {
    folderPath: folderPath
  });

  return nextState;
}

// State argument is not application state, only the state this reducer is responsible for
export default function fetchGraph(state = initialState, action) {
  let newState;
  switch (action.type) {
    case CREATE_GRAPH:
      return createGraph(state, action);
    case ADD_NODE:
      newState = addNode(state, action);
      return Object.assign(newState, {dependencyGraph : Object.assign({}, newState.graph)});
    case ADD_CONTROL_NODE:
      newState = addControlNode(state);
      return Object.assign(newState, {dependencyGraph : Object.assign({}, newState.graph)});
    case "SET_DETAILS":
      newState =  setDetails(state, action);
      return Object.assign(newState, {dependencyGraph : Object.assign({}, newState.graph)});
    case "SAVE_GRAPH":
      return saveGraph(state, action);
    case "LOAD_NETWORK":
      newState = loadNetwork(state, action);
      return Object.assign(newState, {dependencyGraph : Object.assign({}, newState.graph)});
    case "DEPENDENCY_RESPONSE":
      console.log(JSON.stringify(action));
      return dependencyResponse(state, action);
    case "TO_MORALIZED":
      if(action.payload.activeUnit === 2) {
        return toMoralized(state, action);
      }
      return state;
    case "POPULATE_DATA":
      return populateGraphData(state, action);
    case "CHOOSE_OBSERVED":
      const observed = action.payload;
      const nextState = Object.assign({}, state);
      const { dependencyGraph , graph} = state;

      // set node parents
      const nodes = Array.from(dependencyGraph.nodes);

      const newNodes = Array.from(nodes, (node) => {
        if(observed.indexOf(node.id) > -1) {
          return Object.assign({}, node, {color : 'blue'});
        }else{
          return Object.assign({}, node, {color : '#41e0c9'});
        }
      });

      Object.assign(nextState, {
        dependencyGraph: {
          graph,
          nodes : newNodes,
          edges: nextState.graph.edges
        }
      });

      return nextState;
    default:
      return state;
  }
}


