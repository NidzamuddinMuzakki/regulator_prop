import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Row, Col } from 'reactstrap'
import { rgbToHex } from '@coreui/coreui/dist/js/coreui-utilities'

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import API from 'api';

class ReportView extends Component {
  constructor(props) {
    super(props);
    this.cols = [
      {
        data: 'roleid',
        readOnly: true,
        allowEmpty: false
      },
      {
        data: 'rolename',
        readOnly: true,
        allowEmpty: false
      }
    ]
    this.colsEdit = [
      {
        data: 'roleid',
        readOnly: false,
        allowEmpty: false
      },
      {
        data: 'rolename',
        readOnly: false,
        allowEmpty: false
      }
    ]
    this.colsHeader = ['Role ID','Role Name']
    this.dataChanges = []
    this.hotSettings = {
      // data: Handsontable.helper.createSpreadsheetData(100, 500),
      //data: this.getUserData(), //this.createEmptyCell(500,20),
      columns: this.colsEdit,
      colWidths: [150, 200],
      width: '100%',
      height: 320,
      rowHeights: 23,
      //colHeaders: true,
      //colHeaders: this.colsHeader,
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
      manualColumnMove: true,

      afterOnCellMouseOver: (event, coords) => {
        // console.log('afterOnCellMouseOver : '+coords.col + " | "+coords.row + " | " + this.hotTableComponent.current.hotInstance.getColHeader(coords.col))
        // console.log(this.hotTableComponent.current.hotInstance.getCellMeta(coords.row,coords.col).prop)
        if(this.cols[0].readOnly === false) {
          if(this.hotTableComponent.current.hotInstance.getCellMeta(coords.row,coords.col).prop==='roleid') {
            this.hotTableComponent.current.hotInstance.updateSettings({
               columns: this.colsEdit
             });         
           }
        }
      },
      beforeRemoveRow: (index, amount, physicalRows) => {
        console.log(index + " - "+amount)
        console.log(this.hotTableComponent.current.hotInstance.getCellMeta(index,0).prop)

        //check and remove from dataChanges
        let tempObject = {Action:"", RowNumber:null, Key:{FieldName:"roleid",FieldValue:""}, RecordData:{}}
        let removedOpt = ""
        let removedKey = ""
        let isNew = false
        for(let i=0;i<this.dataChanges.length;i++) {
          if(this.dataChanges[i].RowNumber==index) {
            removedOpt = this.dataChanges[i].Action
            removedKey = this.dataChanges[i].Key.FieldValue
            this.dataChanges.splice(i,1)
            isNew = true
          }
        }
        //insert as D if not I
        if(isNew && removedOpt!="I") {
          tempObject.Action = 'D'
          tempObject.RowNumber = null
          tempObject.Key.FieldValue = removedKey
          this.dataChanges.push(tempObject)
        } else {
          tempObject.Action = 'D'
          tempObject.RowNumber = null
          tempObject.Key.FieldValue = this.hotTableComponent.current.hotInstance.getDataAtCell(index,0)
          this.dataChanges.push(tempObject)
        }
        //adjust dataChanges Row index
        console.log(index)
        for(let i=0;i<this.dataChanges.length;i++) {
          if(this.dataChanges[i].RowNumber>=index)
          this.dataChanges[i].RowNumber -= 1
        }
        console.log(this.dataChanges)
      },
      afterRemoveRow: (index, amount, physicalRows) => {
      
      },
      beforeCreateRow: (index, amount, source) => {
        //adjust dataChanges Row index
        console.log(index)
        for(let i=0;i<this.dataChanges.length;i++) {
          if(this.dataChanges[i].RowNumber>=index)
          this.dataChanges[i].RowNumber += 1
        }
        console.log(this.dataChanges)
      },
      afterCreateRow: (index, amount, source) => {
        //console.log(index+" - "+amount)
      },
      beforeChange: (changes,source) => {
        // console.log('beforeChange')
        //console.log(this.hotTableComponent.current.hotInstance.getCellMeta(changes[0],0))
        
        let tempObject = {Action:"", RowNumber:null, Key:{FieldName:"roleid",FieldValue:""}, RecordData:{}}
        let isExists = false

        if(this.hotTableComponent.current.hotInstance.getCellMeta(changes[0][0],0).prop=='roleid') {
          //validation
          for(let i=0;i<this.hotTableComponent.current.hotInstance.getSourceData().length;i++) {
            //console.log(this.hotTableComponent.current.hotInstance.getDataAtCell(i,0),changes[0][3])
            if(this.hotTableComponent.current.hotInstance.getDataAtCell(i,0)==changes[0][3]) {
              return false;
            }
          }
        }
        
        for(let i=0;i<this.dataChanges.length;i++) {
          if(this.dataChanges[i].RowNumber==changes[0][0]) {
            isExists = true
            //tempObject.RecordData[changes[0][1]] = changes[0][3]
            this.dataChanges[i].RecordData[changes[0][1]] = changes[0][3]
          }
        }
        if(isExists == false) {
          if(changes[0][2]==undefined) { //new record
            tempObject.Action = 'I'
            if(changes[0][1]=="roleid") {
              tempObject.Key.FieldValue = changes[0][3]
            }
            tempObject.RowNumber = changes[0][0]
            tempObject.RecordData[changes[0][1]] = changes[0][3]
          } else {
            tempObject.Action = 'U'
            tempObject.RowNumber = changes[0][0]
            tempObject.Key.FieldValue = this.hotTableComponent.current.hotInstance.getDataAtCell(changes[0][0],0)
            tempObject.RecordData[changes[0][1]] = changes[0][3]
          }
          this.dataChanges.push(tempObject)
        }
        console.log(this.dataChanges)
      
      },
      afterChange: (changes,source) => {
        if (source !== 'loadData') {
          this.hotTableComponent.current.hotInstance.updateSettings({
            columns: this.cols
          });
          this.hotTableComponent.current.hotInstance.updateSettings({
            columns: this.colsEdit
          });

        }
      }
    };
    this.state = {
    }
    this.hotTableComponent = React.createRef();
  }
  getTableData = () => {
    //console.log("this.hotSettings.data")
    // console.log(this.hotSettings.data)
    // console.log("this.hotTableComponent.current.hotInstace.getSourceData()")
    // console.log(this.hotTableComponent.current.hotInstance.getSourceData());
    // console.log("this.hotTableComponent.current.hotInstance.getData()")
    // console.log(this.hotTableComponent.current.hotInstance.getData())
    this.hotTableComponent.current.hotInstance.updateSettings({
      columns: this.cols
    });
    this.hotTableComponent.current.hotInstance.validateColumns([0,1,2],(valid) => {
      if (valid) {
        // ... code for validated columns
        API.post("/api/credential/role/put", null, { 
          params: {
            data: this.dataChanges,//this.hotTableComponent.current.hotInstance.getSourceData(),
            len: this.hotTableComponent.current.hotInstance.getSourceData().length
          }
        }).then(data => {
          // console.log(data);
        });
      } else {
        alert("Invalid!");
      }
    })
  }
  resetTableData = () => {
    this.getRoleData();  
    this.dataChanges = []
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
      columns: this.colsEdit,
      colHeaders: this.colsHeader
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
  getConfig = () => {
    API.get("/api/report/config/get?report=LB01").then(data => {
      console.log(data.data.table);
      // this.hotTableComponent.current.hotInstance.updateSettings(
      //   JSON.parse(data.data).table
      // );
      
    })
  }
  componentWillMount () {
    //alert("will mount..")
    console.log("will mount..")
    this.getConfig();    
  }

  render() {

    return (
      <div id="hot-app">
        <button id="btnReset" onClick={this.resetTableData}>Reset</button>
        <button id="btnSave" onClick={this.getTableData}>Save</button>

        <button id="btnEdit" onClick={this.editTableData}>Edit</button>
        <button id="btnLock" onClick={this.lockTableData}>Lock</button>
        
        <a href={`http://localhost:3001/api/credential/role/download/excel`} >Download</a>

        <HotTable ref={this.hotTableComponent} id="hot2" settings={this.hotSettings} licenseKey="non-commercial-and-evaluation" />
      </div>
    )
  }
}

export default ReportView;
