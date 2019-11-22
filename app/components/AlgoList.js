import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {selectAlgo} from '../actions/graph';
import {Link} from "react-router-dom";
import {Route} from "react-router";

type Props = {
  algo : Array,
  selectAlgo: () => void
};

class AlgoList extends Component<Props> {


  renderList(){
    const {algo: algo1} = this.props;
    return algo1.map(algo => {
      const {selectAlgo: selectAlgo1} = this.props;
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        <li key={algo.title} className="nav-item active">
          <Route render={({history}) => (
          <a onClick={() => {selectAlgo1(algo); history.push("/algo")}}>
            <div className="nav-link">{algo.title}<span className="sr-only">(current)</span></div>
          </a>
          )}/>
        </li>
      );
    });
  }


  render(){
    return(
        this.renderList()
    )
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props in the container
  return {
    algo: state.algo
  };
}

// Anything returned from this function will end up as props
// on the BookList container
function mapDispatchToProps(dispatch) {
  // Whenever selectAlgo is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({ selectAlgo}, dispatch);
}

// Promote AlgoList from a component to a container - it needs to know
// about this new dispatch method, selectAlgo. Make it available as a prop.
// connect to redux  and asked for data
export default connect(mapStateToProps , mapDispatchToProps)(AlgoList);


// another option:
// export default connect(mapStateToProps , {selectAlgo})(AlgoList);
