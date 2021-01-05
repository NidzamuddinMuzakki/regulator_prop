import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Row, Col } from 'reactstrap'
import { rgbToHex } from '@coreui/coreui/dist/js/coreui-utilities'

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

class ReportView extends Component {
  constructor(props) {
    super(props);
    // this.data = [
    //   ["2016", 10, 11, 12, 13],
    //   ["2017", 20, 19, 18, 17],
    //   ["2018", 120, 129, 138, 317]
    // ];
    // this.header = ['', 'Ford', 'Volvo', 'Toyota', 'Honda']; 
    // this.handsontableData = Handsontable.helper.createSpreadsheetData(6, 10);
    //this.data = this.createEmptyCell(10,3);
    this.cols = [
      {
        data: 'car',
        readOnly: true
      },
      {
        data: 'year',
        type: 'numeric',
        readOnly: true
      },
      {
        data: 'price_usd',
        type: 'numeric',
        numericFormat: {
          pattern: '$0,0.00',
          culture: 'en-US' // this is the default culture, set up for USD
        },
        allowEmpty: false,
        readOnly: true
      }
    ]
    this.hotSettings = {
      // data: Handsontable.helper.createSpreadsheetData(100, 500),
      data: this.createEmptyCell(500,20),
      columns: this.cols,
      colWidths: 100,
      width: '100%',
      height: 320,
      rowHeights: 23,
      // colHeaders: true,
      //colHeaders: ['','Ford','Volvo'],
      rowHeaders: true,
      columnSorting: true,
      contextMenu: {
        items: {
          'undo': {},
          'redo': {},
          'separator': Handsontable.plugins.ContextMenu.SEPARATOR,
          'row_above': {
            name: 'Insert row above'
          },
          'row_below': {},
          'separator': Handsontable.plugins.ContextMenu.SEPARATOR,
          'remove_row': {},
          'separator': Handsontable.plugins.ContextMenu.SEPARATOR
        }
      },
      manualColumnResize: true,
      manualRowResize: true,
      manualRowMove: true,
      manualColumnMove: true
    };
    this.state = {
      settings: {
        data: Handsontable.helper.createSpreadsheetData(15, 20),
        width: 570,
        height: 220,
      }
    }
    this.hotTableComponent = React.createRef();
  }
  getTableData = () => {
    //alert("Retrieving Table content..")
    console.log("this.hotSettings.data")
    console.log(this.hotSettings.data)
    console.log("this.hotTableComponent.current.hotInstace.getSourceData()")
    console.log(this.hotTableComponent.current.hotInstance.getSourceData());
    console.log("this.hotTableComponent.current.hotInstance.getData()")
    console.log(this.hotTableComponent.current.hotInstance.getData())
    this.hotTableComponent.current.hotInstance.validateColumns([0,1,2],(valid) => {
      if (valid) {
        // ... code for validated columns
      } else {
        alert("Invalid!");
      }
    })
  }
  resetTableData = () => {
    // this.hotSettings.data = this.createEmptyCell(10,3);
    this.hotTableComponent.current.hotInstance.loadData(this.createEmptyCell(10,3));
  }
  lockTableData = () => {
    for(let i=0;i<this.cols.length;i++) {
      this.cols[i].readOnly = true;
    }
    this.hotTableComponent.current.hotInstance.updateSettings({
      columns: this.cols
    });
  }
  editTableData = () => {
    for(let i=0;i<this.cols.length;i++) {
      this.cols[i].readOnly = false;
    }
    this.hotTableComponent.current.hotInstance.updateSettings({
      columns: this.cols
    });
  }
  createEmptyCell = (x,y) => {
    var _data = [];
    var _row = [];

    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        _row.push("");
      }
      _data.push(_row);
      _row = [];
    }
    return _data;
  }
  handleChange = (setting, states) => {
    return (event) => {
      this.setState({
        settings: {
          [setting]: states[event.target.checked ? 1 : 0],
        }
      });
    }
  };

  componentDidMount () {

  }

  render() {

    return (
      <div id="hot-app">
        <button id="btnReset" onClick={this.resetTableData}>Reset</button>
        <button id="btnSubmit" onClick={this.getTableData}>Submit</button>

        <button id="btnEdit" onClick={this.editTableData}>Edit</button>
        <button id="btnLock" onClick={this.lockTableData}>Lock</button>
        
        <HotTable ref={this.hotTableComponent} id="hot2" settings={this.hotSettings} licenseKey="non-commercial-and-evaluation" />
      </div>
    )
  }
}

export default ReportView;
