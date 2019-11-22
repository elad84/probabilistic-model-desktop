import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

type Props = {
  clickHandler: () => void
};

/**
 * `SelectField` is implemented as a controlled component,
 * with the current selection set through the `value` property.
 * The `SelectField` can be disabled with the `disabled` property.
 */
export default class NetworkTypeSelect extends Component<Props>{
  state = {
    value: "GENERAL",
  };

  handleChange = (event, index, value) => {
    this.setState({value});
  };

  render() {
    const {value} = this.state;
    const {clickHandler} = this.props;
    return (
      <div>
        <SelectField
          floatingLabelText="Network Type"
          value={value}
          onChange={clickHandler}
        >
          <MenuItem value="GENERAL" primaryText="Regular" />
          <MenuItem value="ITERATIVE" primaryText="Layered" />
        </SelectField>
      </div>
    );
  }
}
