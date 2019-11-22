import React, {Component} from 'react';
import {Dialog, FlatButton, MenuItem, SelectField, TextField} from "material-ui";

type Props = {
  chosenNode: number,
  nodeParents: array,
  nodeLabel: string,
  nodeDomain: string,
  nodeLabelExists: boolean,
  closeCallback: () => void,
  setNodeDetails: () => void,
  domainChanged: () => void,
  labelChanged: () => void,
  parentChanged: () => void,
  open: () => void,
  nodesList: Array,
  domainChanged: () => void,
  closeCallback: () => void,
  chosenNode: () => void,
  deleteNode: () => void
};

export default class NodeDialog extends Component <Props> {
  props: Props;

  state = {
    chosenMap: {

    }
  };

  handleFullClose() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      open: undefined
    })
  }

  render() {
    const {
      open,
      nodesList,
      closeCallback,
      chosenNode,
      deleteNode,
      nodeParents,
      nodeLabel,
      nodeDomain,
      labelChanged,
      domainChanged,
      parentChanged,
      setNodeDetails,
      nodeLabelExists
    } = this.props;

    const actions = [
      <FlatButton
        label="Delete"
        primary
        onClick={() => deleteNode(chosenNode)}
      />,
      <FlatButton
        label="Cancel"
        primary
        onClick={closeCallback}
      />,
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onClick={ () => {if(nodeLabelExists) return ; setNodeDetails()}}
      />
    ];

    const openState = open;
    const potentialParents = Array.from(nodesList);

    const parentList = [];
    parentList.push(<MenuItem key="null1" value={null} primaryText=""/>);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < potentialParents.length; i++) {
      parentList.push(<MenuItem key={potentialParents[i].id} value={potentialParents[i].id} primaryText={potentialParents[i].label}
                                insetChildren/>)
    }

    const labelError = nodeLabelExists ? `Label ${nodeLabel} already exists` : '';
    return (
      <Dialog
        title="Node details"
        actions={actions}
        modal={false}
        open={openState}
        onRequestClose={this.handleFullClose.bind(this)}
      >
        <div>
          <TextField
            hintText="0-1 or Name1, Name2..."
            value={nodeDomain}
            floatingLabelText="Domain"
            onBlur={e => domainChanged(e.target.value)}
            onChange={e => domainChanged(e.target.value)}
          />
        </div>
        <div>
          <TextField
            hintText="Node 1"
            value={nodeLabel}
            floatingLabelText="Label"
            errorText={labelError}
            onBlur={e => labelChanged(e.target.value)}
            onChange={e => labelChanged(e.target.value)}
          />
        </div>
        <div>
          <SelectField
            floatingLabelText="Choose Parents"
            id="1"
            value={nodeParents}
            multiple
            onChange={parentChanged}
          >
            {parentList}
          </SelectField>
        </div>
      </Dialog>
    );
  }
}
