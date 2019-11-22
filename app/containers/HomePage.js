// @flow
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Home from '../components/Home';
import {loadNetwork} from "../actions/graph";

function mapStateToProps(state) {
  return {
    folderPath: state.graphData.folderPath
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadNetwork}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
