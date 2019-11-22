import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addControlNode, deleteNode, handleAddNode, saveGraph, setNodeDetails} from "../actions/EditNetwork";
import EditNetwork from "../components/EditNetwork";
import {loadNetwork} from "../actions/graph";


function mapStateToProps(state) {
  return {
    graph: state.graphData,
    nodes: state.graphData.nodes,
    nodesMap: state.graphData.nodesMap,
    networkFile : state.graphData.networkFile,
    networkName: state.graphData.networkName,
    networkType : state.graphData.networkType,
    unsaved: state.graphData.unsaved
  };
}


const mapDispatchToProps = (dispatch) => bindActionCreators({addControlNode, handleAddNode, saveGraph, loadNetwork, deleteNode, setNodeDetails}, dispatch);


const EditGraph = connect(mapStateToProps, mapDispatchToProps)(EditNetwork);
export default EditGraph;
