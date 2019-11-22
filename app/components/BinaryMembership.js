import ReactTable from "react-table";
import React, {Component} from "react";

export default class BinaryMembership extends Component {
  render() {
    const data = [{
      nodeName: 'X1',
      potential: [0, 1],
      friend: {
        name: 'Jason Maurer',
        age: 23,
      }
    }];

    const columns = [{
      Header: 'Nodes/Potentials',
      accessor: 'nodeName'
    }, {
      id: 'potential', // Required because our accessor is not a string
      Header: 'Potential 1',
      accessor: d => d.potential[0] // Custom value accessors!
    }];

    return <ReactTable
      data={data}
      columns={columns}
    />
  }
}
