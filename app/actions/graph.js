// @flow
import axios from "axios";

export const CREATE_GRAPH = 'CREATE_GRAPH';
export const CHOOSE_FOLDER = 'CHOOSE_FOLDER';
export const LOAD_NETWORK = 'LOAD_NETWORK';
export const createGraph = (data) => ({
  type: CREATE_GRAPH,
  networkName: data.name,
  nodeCount: data.count,
  networkType: data.type,
  layerCount: data.layerCount
});

export function selectAlgo(algo) {
  // selectAlgo is an ActionCreator, it needs to return an action,
  // an object with a type property.
  return {
    type: "ALGO_SELECTED",
    payload: algo
  };
}

export function chooseFolder(folder) {
  return {
    type: CHOOSE_FOLDER,
    payload: folder
  }
}

export function loadNetwork(filePath, history) {
  return (dispatch) => axios.get(`http://localhost:8080/bayesian/network/load?name=${filePath}`)
      .then((response) => {
        const {data} = response;
        const networkData = {
          networkName: data.name,
          networkFile: filePath,
          type: data.type,
          nodes: data.nodes,
          edges: data.edges
        };
        dispatch({
          type: LOAD_NETWORK,
          payload: networkData
        });
        history.push("/edit");
      });

}
