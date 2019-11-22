// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import graphData from "./graphs";
import selectAlgo from "./algoPage";

function algo() {
  return [
    { id: 1, title: "Dependencies", subTitle: "Marginal and conditional dependency", comment: "Please select root node"},
    { id: 2, title: "Undirected", pages: 39 },
    { id: 3, title: "Elimination", pages: 85 },
    // { id: 4, title: "Inference", pages: 1 },
    // { id: 5, title: "5", pages: 1 },
    // { id: 6, title: "6", pages: 1 }
  ];
}

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter,
    graphData,
    activeAlgo: selectAlgo,
    algo: algo
  });
}



