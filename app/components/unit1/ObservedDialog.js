import React, { Component } from 'react';
import { Dialog, FlatButton, MenuItem, SelectField } from 'material-ui';

type Props = {
  setObserved: Function,
  closeCallback: Function,
  open: boolean,
  nodesList: Array,
  observedNodes: Array
};

class ConnectedObservedDialog extends Component<Props> {
  handleChangeParents(event, index, values) {
    const { setObserved } = this.props;
    setObserved(values);
  }

  handleClose() {
    const { closeCallback } = this.props;
    closeCallback();
  }

  setObserved() {
    // this.props.setObserved(this.state.observedNodes);
    this.handleClose();
  }

  handleFullClose() {
    this.setState({
      // open : undefined
    });
  }

  render() {
    const {
      closeCallback,
      open: openState,
      nodesList: parents,
      observedNodes
    } = this.props;

    const actions = [
      <FlatButton label="Cancel" primary onClick={closeCallback} />,
      <FlatButton
        label="Set Observed"
        primary
        keyboardFocused
        onClick={this.setObserved.bind(this)}
      />
    ];

    // const openState = this.props.open,
    //   parents = this.props.nodesList;

    const parentList = [];
    parentList.push(<MenuItem key="null1" value={null} primaryText="" />);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < parents.length; i++) {
      parentList.push(
        <MenuItem
          key={parents[i].id}
          value={parents[i].id}
          primaryText={parents[i].label}
          insetChildren
        />
      );
    }
    return (
      <Dialog
        title="Set Observed"
        actions={actions}
        modal={false}
        open={openState}
        onRequestClose={this.handleFullClose.bind(this)}
      >
        <div>
          <SelectField
            floatingLabelText="Choose Observed"
            id="1"
            value={observedNodes}
            multiple
            onChange={this.handleChangeParents.bind(this)}
          >
            {parentList}
          </SelectField>
        </div>
      </Dialog>
    );
  }
}
export default ConnectedObservedDialog;
