import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Route} from "react-router";
import AlgoList from "./AlgoList";

type Props = {
  loadNetwork: () => void
};

class NavigationBar extends Component<Props> {

  loadNetwork(history) {
    const {loadNetwork: loadNetwork1} = this.props;
    loadNetwork1(history);
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#e3f2fd"}}>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link to="/create">
                  <div className="nav-link">New Network<span className="sr-only">(current)</span></div>
                </Link>
              </li>
              <li className="nav-item active">

                <Route render={({history}) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                  <div className="nav-link" onClick={() => {this.loadNetwork(history)}} style={{'cursor': 'pointer'}}>Load Network<span className="sr-only">(current)</span></div>
                )}/>
              </li>
              {/* <li className="nav-item active"> */}
              {/*  <Link to="/algo"> */}
              {/*    <div className="nav-link">Algos<span className="sr-only">(current)</span></div> */}
              {/*  </Link> */}
              {/* </li> */}
              <li className="nav-item active">
                <Link to="/edit">
                  <div className="nav-link">Edit<span className="sr-only">(current)</span></div>
                </Link>
              </li>
             <AlgoList/>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavigationBar;
