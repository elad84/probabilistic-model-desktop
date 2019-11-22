// @flow
export const CREATE_GRAPH = 'CREATE_GRAPH',
  ADD_NODE = "ADD_NODE",
  ADD_CONTROL_NODE = "ADD_CONTROL_NODE",
  SAVE_GRAPH = "SAVE_GRAPH",
  SET_DETAILS = "SET_DETAILS",
  DELETE_NODE = "DELETE_NODE";

export const handleAddNode = () => ({
  type: ADD_NODE
});

export const addControlNode = () => ({
  type: ADD_CONTROL_NODE
});

export const saveGraph = (fileName) => ({
  type: "SAVE_GRAPH",
  fileName
});
export const deleteNode = (nodeId) => ({
  type: DELETE_NODE,
  nodeId
});

export const setNodeDetails = (nodeId, nodeLabel, nodeDomain, parents) => ({
    type: "SET_DETAILS",
    payload: {
      nodeId,
      nodeLabel,
      nodeDomain,
      parents
    }
  });
