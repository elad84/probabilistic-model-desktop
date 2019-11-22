import axios from "axios";
import {toBayesianNetwork} from "../reducers/graph";


const NODE_CHOSEN = "NODE_CHOSEN";
const ADD_NODE = "ADD_NODE";
export const ELIMINATE_NODE = "ELIMINATE_NODE";
export const ELIMINATE_PERFECT = "ELIMINATE_PERFECT";

export const handleEliminationNodeChosen = (node) => {
  return {
    type: NODE_CHOSEN,
    payload: node
  }
};

export const handleAddNode = () => {
  return {
    type: ADD_NODE
  }
};

export function toMoralized(networkName, activeUnit, graph, graphData) {
  return (dispatch) =>
    axios.post(`http://localhost:8080/bayesian/moralized?name=${networkName}`,
      toBayesianNetwork(graph, graphData.nodes, graphData.nodesMap, graphData.name, graphData.networkType, graphData.layersCount))
      .then((response) => {
        dispatch({
          type: "TO_MORALIZED",
          payload: {newEdges: response.data.edges, activeUnit}
        });
      });
}

export function findNextElimination(graph) {
  return (dispatch) => {
    const {nodes, edges} = graph;
    const nodeMap = {};
    const nodeIdMap = {};
    // initialize map
    nodes.forEach(node => {
      nodeMap[node.id] = [];
      nodeIdMap[node.id] = node;
    });

    // add edges for every node
    edges.forEach(edge => {
      nodeMap[edge.from].push({nodeId1 : edge.from, nodeId2 : edge.to});
      nodeMap[edge.to].push({nodeId1 : edge.from, nodeId2 : edge.to});
    });

    return axios.post('http://localhost:8080/undirected/elimination/prefect', {
      nodeEdge: nodeMap
    }).then(response => {
      if(response.data.simplicalNode) {
        alert(`Next simplical node is: ${nodeIdMap[response.data.simplicalNode].label}`);
      }else {
        alert("No simplicl node found");
      }
      // dispatch({
      //   type : ELIMINATE_PERFECT,
      //   payload: response.data
      // });
    });
  }
}

export function eliminateNode(nodeId, graph) {
  return (dispatch) => {
    const {nodes, edges} = graph;
    const nodeMap = {};
    // initialize map
    nodes.forEach(node => {
      nodeMap[node.id] = [];
    });

    // add edges for every node
    edges.forEach(edge => {
      nodeMap[edge.from].push({nodeId1 : edge.from, nodeId2 : edge.to});
      nodeMap[edge.to].push({nodeId1 : edge.from, nodeId2 : edge.to});
    });
    return axios
      .post(`http://localhost:8080/undirected/eliminate/${nodeId}`, {
        nodeEdge: nodeMap
      })
      .then((response) => {
        dispatch({
          type : ELIMINATE_NODE,
          payload: response.data
        });
      });
  }
}
