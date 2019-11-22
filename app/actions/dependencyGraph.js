import axios from "axios";
import {toBayesianNetwork} from "../reducers/graph";

export const TO_MORALIZED = "TO_MORALIZED";
export const CHOOSE_OBSERVED = "CHOOSE_OBSERVED";
export const DEPENDENCY_RESPONSE = "DEPENDENCY_RESPONSE";
export const RESET_GRAPH = "RESET_GRAPH";
export const ROOT_CHOSEN = "ROOT_CHOSEN";

export function setObserved(observed) {
  return (dispatch) => {
    dispatch({
      type : CHOOSE_OBSERVED,
      payload : observed
    });
  };
}


export function checkDependency(rootNode, observed, graph, nodes, nodesMap, name, networkType, layersCount) {
  return (dispatch) =>
    axios.post('http://localhost:8080/bayesian/dependency/check', {
      rootNodeId: rootNode,
      observedNodes: observed,
      network: toBayesianNetwork(graph, nodes, nodesMap, name, networkType, layersCount)
    }).then((response) => {
      dispatch({
        type: DEPENDENCY_RESPONSE,
        payload: {edges: response.data.edges, observed, rootNode, nodes: response.data.nodes}
      });
    });
}

export function resetDependencyGraph() {
  return {
    type: RESET_GRAPH,
    payload: 1
  }
}

export function resetMoralizeGraph() {
  return {
    type: RESET_GRAPH,
    payload: 2
  }
}

export function resetEliminationGraph() {
  return {
    type: RESET_GRAPH,
    payload: 3
  }
}

export function handleRootChosen(nodeId) {
  return{
    type: ROOT_CHOSEN,
    payload: nodeId
  }
}

export function toMoralized(networkName, activeUnit, graph, graphData) {
  return (dispatch) => axios.post(`http://localhost:8080/bayesian/moralized?name=${networkName}`,
      toBayesianNetwork(graph, graphData.nodes, graphData.nodesMap, graphData.name, graphData.networkType, graphData.layersCount))
      .then((response) => {
        dispatch({
          type: TO_MORALIZED,
          payload: { newEdges : response.data.edges, activeUnit}
        });
      });
}
