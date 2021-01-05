import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Row, Col } from 'reactstrap'
import { rgbToHex } from '@coreui/coreui/dist/js/coreui-utilities'

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import API from 'api';

//import {FieldMapping} from 'components/fieldmapper/FieldMapping'
//const FieldMapping = React.lazy(() => import('components/fieldmapper/FieldMapping'));
import FieldMapping from 'components/fieldmapper/FieldMapping'

const sourceCols = [
  { title: 'Name', key: 'name', width: '80px' },
  { title: 'Type', key: 'type', width: '100px' },
  { title: 'Description', key: 'desc', width: '150px' },
  { title: 'Operate', key: 'operate', width: '80px', align: 'center', render: (value, record) => {
    return <a href="javascript:void(0);" onClick={
      () => {
        alert(JSON.stringify(record));
      }
    }>...</a>;
  }}
];
const targetCols = [
  { title: 'Name', key: 'name', width: '50%' },
  { title: 'Type', key: 'type', width: '50%' }
];

class Kerno extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      relation: [{
        source: {
          name: "field1",
          type: "xxxxxx",
          key: "field1"
        },
        target: {
          name: "field5",
          type: "xxxxxx",
          key: "field5"
        }
      }],
      sourceData: new Array(7).fill().map((item, idx) => ({
        name: `field${idx + 1}`,
        type: 'string',
        key: `keyfield${idx + 1}`,
        desc: `field${idx + 1}`,
        operate: `operate${idx}`
      })),
      targetData: new Array(11).fill().map((item, idx) => ({
        name: `field${idx + 4}`,
        type: 'string',
        key: `field${idx + 4}`
      }))
    }

  }
  getRelation() {
    console.log(this.state.relation);
    alert(JSON.stringify(this.state.relation));
  }
  sameLine() {
    const {sourceData, targetData} = this.state;
    const len = sourceData.length > targetData.length ? targetData.length : sourceData.length;
    const relation = [];
    for(let i=0; i<len; i++ ) {
      relation.push({
        source: sourceData[i],
        target: targetData[i]
      });
    }
    this.setState({
      relation
    });
  }
  sameName() {
    const {sourceData, targetData} = this.state;
    const relation = [];
    sourceData.map(item => {
      targetData.map(n => {
        if(item.name === n.name) {
          relation.push({
            source: item,
            target: n
          });
        }
      });
    });
    this.setState({
      relation
    });
  }
  cancelRelation() {
    this.setState({
      relation: []
    });
  }
  render() {
    const { sourceData, targetData } = this.state;
    const option = {
      source: {
        data: sourceData,
        onChange: (data) => { // isSort开启后，必须开启才会生效
          this.setState({
            sourceData: data
          });
        },
        columns: sourceCols
      },
      target: {
        data: targetData,
        onChange: (data) => {
          this.setState({
            targetData: data
          });
        },
        columns: targetCols
      },
      relation: this.state.relation,
      // onDrawStart: (source, relation) => {
      //   console.log("onDrawStart: ", source, relation);
      // },
      // onDrawing: (source, relation) => {
      //   console.log("onDrawing: ", source, relation);
      // },
      // onDrawEnd: (source, target, relation) => {
      //   console.log("onDrawEnd: ", source, relation);
      // },
      onChange: (relation) => {
        this.setState({
          relation
        });
      },
      isSort: true
    };
    return (
      <div>
        <div>
          <div style={{width: 800}}>
            <FieldMapping {...option} />
            <br/>
            <button onClick={this.getRelation.bind(this)}>Get Relation</button>
            <button onClick={this.sameLine.bind(this)}>Auto (Same Line)</button>
            <button onClick={this.sameName.bind(this)}>Auto (Same Name)</button>
            <button onClick={this.cancelRelation.bind(this)}>Reset Relation</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Kerno;
