// @flow
export const CREATE_GRAPH = 'CREATE_GRAPH';

export const ADD_NODE = 'ADD_NODE';

export const ADD_CONTROL_NODE = 'ADD_CONTROL_NODE';

export const SAVE_GRAPH = 'SAVE_GRAPH';

export const SET_DETAILS = 'SET_DETAILS';

export const DELETE_NODE = 'DELETE_NODE';

export const handleAddNode = () => ({
  type: ADD_NODE
});

export const addControlNode = () => ({
  type: ADD_CONTROL_NODE
});

export const saveGraph = (fileName, networkName) => ({
  type: 'SAVE_GRAPH',
  payload: {
    fileName,
    networkName
  }
});
export const deleteNode = nodeId => ({
  type: DELETE_NODE,
  nodeId
});

export const setNodeDetails = (nodeId, nodeLabel, nodeDomain, parents) => ({
  type: 'SET_DETAILS',
  payload: {
    nodeId,
    nodeLabel,
    nodeDomain,
    parents
  }
});
