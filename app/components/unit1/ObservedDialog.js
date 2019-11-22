import React, {Component} from 'react';
import {Dialog, FlatButton, MenuItem, SelectField} from "material-ui";
import {connect} from "react-redux";

const style = {
  margin: 12
};

class ConnectedObservedDialog extends Component {

  state = {
    observedNodes : []
  };

  handleChangeParents(event, index, values) {
    this.setState({
      observedNodes : values
    });
  }

  handleClose(){
    this.props.closeCallback();
  }

  setObserved() {
    this.props.setObserved(this.state.observedNodes);
    this.handleClose();
  }

  handleFullClose() {
    this.setState({
      open : undefined
    })
  }

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.closeCallback}
      />,
      <FlatButton
        label="Set Observed"
        primary={true}
        keyboardFocused={true}
        onClick={this.setObserved.bind(this)}
      />
    ];

    const openState = this.props.open,
      parents = this.props.nodesList;

    const parentList = [];
    parentList.push(<MenuItem key="null1" value={null} primaryText=""/>);
    for (let i = 0; i < parents.length; i++) {
      parentList.push(<MenuItem key={parents[i].id} value={parents[i].id} primaryText={parents[i].label}  insetChildren={true}/>)
    }
    return (
      <Dialog
        title="Set Observed"
        actions={actions}
        modal={false}
        open={openState}
        onRequestClose={this.handleFullClose.bind(this)}>

        <div>
          <SelectField
            floatingLabelText="Choose Observed"
            id="1"
            value={this.state.observedNodes}
            multiple={true}
            onChange={this.handleChangeParents.bind(this)}>
            {parentList}
          </SelectField>
        </div>
      </Dialog>
    );
  }
}
export default ConnectedObservedDialog;
