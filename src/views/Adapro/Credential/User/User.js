import React, { Component } from 'react';
import Table from "./../../../../components/Table";
import authMethod from './../../../../auth/authMethod';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'
import Tooltip from '@material-ui/core/Tooltip';  
import Filterdata from './../../filter';
import Skeleton from './../../../../components/Skeleton';
import { saveAs } from 'file-saver';
import axios from 'axios'
import { Button,Col, Modal, ModalBody,  Form,
  FormGroup,
 FormFeedback, 
  Card,
  CardBody,
  CardFooter,
  CardHeader,Label,Input,
  } from 'reactstrap'
 import QueryBuilder from 'react-querybuilder';

import {Query, Builder, BasicConfig, Utils as QbUtils} from 'react-awesome-query-builder';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import API from 'api';
import decode from 'jwt-decode';
import { cosh } from 'core-js/fn/number';
import { data } from 'jquery';
import Dialog from './../../../../components/popup';




 
// You can load query value from your backend storage (for saving see `Query.onChange()`)




const isOpen1 = (payload) => ({
  type: "OPEN",
  payload,
 
})
const fields = [
  { name: 'Branch', label: 'Branch' },
  { name: 'Department', label: 'Department' },
  { name: 'Username', label: 'Username' },
  { name: 'Name', label: 'Name' },
  { name: 'Group', label: 'Group' },
  { name: 'Nik', label: 'Nik' },
  { name: 'Created Time', label: 'Created Time' },
  { name: 'Updated Time', label: 'Created Time', value: false }
];

const operators = [
  { name: "=", label: "=" },
  { name: "!=", label: "!=" },
  { name: "<", label: "<" },
  { name: ">", label: ">" },
  { name: "<=", label: "<=" },
  { name: ">=", label: ">=" },
  { name: "null", label: "Is Null" },
  { name: "notNull", label: "Is Not Null" },
  { name: "in", label: "In" },
  { name: "notIn", label: "Not In" }
];
const mapDispatchToProps = dispatch =>{
  return {
    membuka:()=>dispatch({type:"OPEN", payload:{isOpen:true}}),
    kirimSelected:()=>dispatch({type:"SELECTEDUSER", payload:{ selectedUser: 0,
      selectedId: []}}),
    kirimPaging:(jumlah,halaman)=>dispatch({type:"CHANGEROWUSER", payload:{ jumlah: jumlah,
        halaman: halaman}})
  }
}
const userSelected1 = state => ({
  jumlah: state.userSettingSelected,
  terbuka:state.popup,
  perpage:state.rowperpageUser,
  userAcces:state.userAcces,
  MenuAcces:state.MenuAccess
})


class UserView extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      btnEdit : true,
      btnSave : false,
      btnFilter : false,
      saveClicked : false,
      dataSet :  [],
      modalEdit: false,
      modalAdd: false,
      modalInsert: false,
      Auth:new authMethod(),
      selRow: 0,
      rows: 1,
      actionForm:"",
      dataSelected :this.props.jumlah,
      modalAction : '',
      dept:[],
      role:[],
      group:[],
      branch:[],
      isvalid : true,
      irnumber: 0,
      editStart: false,
      isOpen:false,
      jumlah:5,
      perpage:5,
      halaman:1,
      filterOpen:false,
      schema:[],
      dataFilter:[],
      schema1:[],
      loading:true,
      menuAcces:{access_view:false,
      access_create:false,
      access_update:false,
      access_delete:false},
      initValue : '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["~#iOM",["a98ab9b9-cdef-4012-b456-71607f326fd9",["^0",["type","rule","id","a98ab9b9-cdef-4012-b456-71607f326fd9","properties",["^0",["field","multicolor","operator","multiselect_equals","value",["~#iL",[["yellow","green"]]],"valueSrc",["^2",["value"]],"operatorOptions",null,"valueType",["^2",["multiselect"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","a98ab9b9-cdef-4012-b456-71607f326fd9"]]]]]],"properties",["^0",["conjunction","AND","not",false]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]',



       
    
     
    }
   
    this.cols = [
      {data: 'id', readOnly: true, allowEmpty: false},
      {data: 'ir', readOnly: true, allowEmpty: false},
      {data: 'username', readOnly: true, allowEmpty: false, validator: this.usernameValidator},
      {data: 'password', readOnly: true, allowEmpty: false, type: 'password', validator: this.passwordValidator},
      {data: 'roleid', allowEmpty: false, readOnly: true, type: 'dropdown', validator: this.roleidValidator}
    ]
    this.colsEdit = [
      {data: 'id', readOnly: true, allowEmpty: false},
      {data: 'ir', readOnly: true, allowEmpty: false},
      {data: 'username', readOnly: false, allowEmpty: false, validator: this.usernameValidator},
      {data: 'password', readOnly: false, allowEmpty: false, type: 'password', validator: this.passwordValidator},
      {data: 'roleid', allowEmpty: false, readOnly: false, type: 'dropdown', validator: this.roleidValidator}
    ]
    
    this.colsHeader = ['ID','IR','Username','Password','Role ID']
    this.colsWidth = []
    this.dataChanges = []
    this.selRowData = {}
    this.selRowValidation = {}
    this.options = []
    
    //begin new var for filter
    var filtersPlugin
    var debounceFn = Handsontable.helper.debounce((colIndex, event) => {
      filtersPlugin = this.hotTableComponent.current.hotInstance.getPlugin('filters');
      
      filtersPlugin.removeConditions(colIndex);
      filtersPlugin.addCondition(colIndex, 'contains', [event.realTarget.value]);
      filtersPlugin.filter();
    }, 200);
    var addEventListeners = (input, colIndex) => {
      input.addEventListener('keydown', function(event) {
        debounceFn(colIndex, event);
      });
    };
    
    // Build elements which will be displayed in header.
    var getInitializedElements = (colIndex) => {
      var div = document.createElement('div');
      div.setAttribute("id", this.cols[colIndex].data+'filter');
      div.style.cssText = 'display: flex;margin-bottom: 1px; i {positin: absolute;}'
      
      var input = document.createElement('input');
      input.style.cssText = 'width:100%;padding:1px;line-height: 19px;'
      div.className = 'filterHeader';
      addEventListeners(input, colIndex);
      
      var img = document.createElement('i');
      img.className = 'fa fa-filter'
      img.style.cssText = 'background: dodgerblue;padding: 5px;color: white;text-align: center;'

      div.appendChild(img)
      div.appendChild(input);
      
      return div;
    };
    
    // Add elements to header on `afterGetColHeader` hook.
    this.addInput = (col, TH) => {
      // Hooks can return value other than number (for example `columnSorting` plugin use this).
      if (typeof col !== 'number') {
        //if(this.state.btnFilter) 
        return col;
      }
      //console.log(col)
      if(this.state.btnFilter) 
      if (col >= -0 && TH.childElementCount < 2) {
          TH.appendChild(getInitializedElements(col));
      }
      
    };
    this.removeInput = () => {
      for(let i=0;i<this.cols.length;i++) {

        if(filtersPlugin!=undefined) {
          filtersPlugin.clearConditions()
          filtersPlugin.disablePlugin()
        }
        
        document.getElementById(`${this.cols[i].data}filter`).remove()
        if(document.getElementById(`${this.cols[i].data}filter`)!=undefined) {
          document.getElementById(`${this.cols[i].data}filter`).remove()
        }
      }
    }
    
    // Deselect column after click on input.
    this.doNotSelectColumn = function (event, coords) {
      if (coords.row === -1 && event.realTarget.nodeName === 'INPUT') {
        event.stopImmediatePropagation();
        this.deselectCell();
      }
    };

    this.hotSettings = {
      columns: this.cols,
      colWidths: this.colsWidth,
      width: '100%',
      height: 300,
      rowHeights: 23,
      rowHeaders: true,
      colHeaders: this.colsHeader,
      columnSorting: false,
      hiddenColumns: {
        columns: [0,1],
        indicators: false
      },
      comments:true,
      // cell: [
      //   {row: 1, col: 3, comment: {value: 'Some comment'}},
      //   {row: 2, col: 4, comment: {value: 'More comments'}}
      // ],
      //afterGetColHeader: addInput,
      //beforeOnCellMouseDown: doNotSelectColumn,
      contextMenu: {
        items: {
          'undo': {},
          'redo': {},
          'separator': Handsontable.plugins.ContextMenu.SEPARATOR,
        }
      },
      manualColumnResize: true,
      manualRowResize: true,
      manualRowMove: false,
      manualColumnMove: false,
      outsideClickDeselects: false,
      filters: true,
      //dropdownMenu: true,
      //dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
      afterColumnResize: (currentColumn, newSize, isDoubleClick) => {
        this.colsWidth[currentColumn] = newSize
        API.post("/api/credential/user/preference/put", null, { 
          params: {
            data: this.colsWidth,
            username: decode(localStorage.getItem('id_token')).username,
            pagename: 'user',
            componentname: 'colWidths'
          }
        }).then(data => {
          
        });
      },
      
      afterOnCellMouseOver: (event, coords) => {
        if(this.cols[0].readOnly === false) {
          if(this.hotTableComponent.current.hotInstance.getCellMeta(coords.row,coords.col).prop==='roleid') {
            this.hotTableComponent.current.hotInstance.updateSettings({
               columns: this.colsEdit
            })
            
            if(this.state.saveClicked) this.hotTableComponent.current.hotInstance.validateColumns([0,1,2,3,4])
          }
        }
      },
      
      beforeRemoveRow: (index, amount, physicalRows) => {
        //check and remove from dataChanges
        let tempObject = {Action:"", RowNumber:null, RecordData:{}}


        //check previous datachanges
        for(let h=0;h<physicalRows.length;h++) {
          console.log(physicalRows[h])
          for(let i=0;i<this.dataChanges.length;i++) {
            if(this.dataChanges[i].id==this.hotTableComponent.current.hotInstance.getSourceDataAtRow(physicalRows[h])['id']&&this.dataChanges[i].ir==this.hotTableComponent.current.hotInstance.getSourceDataAtRow(physicalRows[h])['ir']) {
              //remove from datachanges
              this.dataChanges.splice(i,1)
            }
          }
          console.log()
          if(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(physicalRows[h])['id']!=null&&this.hotTableComponent.current.hotInstance.getSourceDataAtRow(physicalRows[h])['id']!==undefined&&this.hotTableComponent.current.hotInstance.getSourceDataAtRow(physicalRows[h])['id']!=='') {
            tempObject = {Action:"", RowNumber:null, RecordData:{}}
            tempObject.Action = 'D'
            tempObject.id = this.hotTableComponent.current.hotInstance.getSourceDataAtRow(physicalRows[h])['id']//this.hotTableComponent.current.hotInstance.getDataAtCell(physicalRows[h],0)
            this.dataChanges.push(tempObject)    
          }
        }

        // for(let i=0;i<this.dataChanges.length;i++) {
        //   if(this.dataChanges[i].RowNumber>=index)
        //   this.dataChanges[i].RowNumber -= 1
        // }
        console.log(this.state.selRow)
      },
      afterRemoveRow: (index, amount, physicalRows) => {
      
      },
     
      beforeCreateRow: (index, amount, source) => {
        for(let i=0;i<this.dataChanges.length;i++) {
          if(this.dataChanges[i].RowNumber>=index)
          this.dataChanges[i].RowNumber += 1
        }
      },
      afterCreateRow: (index, amount, source) => {
        
      },
      beforeChange: (changes,source) => {
        if(source!=='IR') {
          // this.setState({
          //   selRow: this.hotTableComponent.current.hotInstance.getSourceData()+1,
          // }, () => {
            for (var i = changes.length - 1; i >= 0; i--) {
              if(changes[i][1]=='roleid') {
                changes[i][3] = changes[i][3].split("-")[0].trim();
              }
            }

            let tempObject = {Action:"", RowNumber:null, RecordData:{}}
            let isExists = false
            
            //if dataChanges already exists on the same records, append the field
            for(let i=0;i<this.dataChanges.length;i++) {
              if(this.dataChanges[i].RowNumber==changes[0][0]) {
                isExists = true
                this.dataChanges[i].RecordData[changes[0][1]] = changes[0][3]
              }
            }
            //if not exists, prepare to create new dataChanges record
            if(isExists == false) {
              
              if(this.hotTableComponent.current.hotInstance.getDataAtCell(changes[0][0],0)==null||this.hotTableComponent.current.hotInstance.getDataAtCell(changes[0][0],0)==undefined) {
                tempObject.Action = 'I'
                
                tempObject.RowNumber = changes[0][0]
                tempObject.RecordData[changes[0][1]] = changes[0][3]
              } else { //update record
                tempObject.Action = 'U'

                tempObject.RowNumber = changes[0][0]
                tempObject.id = this.hotTableComponent.current.hotInstance.getDataAtCell(changes[0][0],0)
                tempObject.RecordData[changes[0][1]] = changes[0][3]
              }
              this.dataChanges.push(tempObject)
            }
          //})
        }
      },
      // afterChange: (changes,source) => {
      //   // this.setState({
      //   //   selRow: 0
      //   // }, () => {
      //     if (source == 'loadData') {
      //       if(this.state.modalAction=='editsave') {
      //         this.hotTableComponent.current.hotInstance.validateRows([this.state.selRow-1], (valid) => {
      //           if (valid) {
      //             this.setState({
      //               modalEdit: !this.state.modalEdit,
      //               modalAction: '',
      //               selRow: 0
      //             }, () => {
      //               for(let i=0;i<this.cols.length;i++) {
      //                 this.cols[i].readOnly = false;
      //               }
      //             })
      //           } else {
      //             alert('Invalid!')
      //             //this.hotTableComponent.current.hotInstance.setDataAtRowProp(this.state.selRow-1,0,_tempSelRowData)
                  
      //           }
      //         })
      //       } else if(this.state.modalAction=='editcancel') {
      //         this.setState({
      //           modalEdit: !this.state.modalEdit,
      //           modalAction: '',
      //           selRow: 0
      //         }, () => {
      //           for(let i=0;i<this.cols.length;i++) {
      //             this.cols[i].readOnly = false;
      //           }
                
      //         })
      //       } 
      //       // else if(this.state.modalAction=='addsave') {
            //   this.hotTableComponent.current.hotInstance.validateRows([this.state.selRow-1], (valid) => {
            //     if (valid) {
            //       this.setState({
            //         modalAdd: !this.state.modalAdd,
            //         selRow: 0,
            //         modalAction: ''
            //       }, () => {

            //       })
            //     } else {
            //       alert('Invalid!')
            //       //this.hotTableComponent.current.hotInstance.setDataAtRowProp(this.state.selRow-1,0,_tempSelRowData)
                  
            //     }
            //   })
            // } else if(this.state.modalAction=='addcancel') {
            //   console.log("ADD CANCEL")
            //   this.setState({
            //     modalAdd: !this.state.modalAdd,
            //     selRow: 0,
            //     modalAction: ''
            //   }, () => {
              
            //   })
            // }
          // } else if (source !== 'loadData' && source!='IR' && source!='edit') {
          //   this.hotTableComponent.current.hotInstance.updateSettings({
          //     columns: this.cols,
          //   });
          // }
        // })
      // },
      // afterValidate: (isValid, value, row, prop, source) => {
      //   if(isValid==false) {
      //     const commentsPlugin = this.hotTableComponent.current.hotInstance.getPlugin('comments');

      //     // Manage comments programmatically:
      //     commentsPlugin.setCommentAtCell(row, this.hotTableComponent.current.hotInstance.propToCol(prop), this.selRowValidation[prop]);
          
      //   }
      // }
    };
    this.hotTableComponent = React.createRef();
  }
  // basicValidator = (name,value) => {
  //   let _ctrExact = 0
  //   let response = {}
    
  //   if(name=='username') {
  //     //console.log(this.state.id+" : "+this.hotTableComponent.current.hotInstance.getDataAtRowProp(this.state.selRow-1,'id'))
      
  //     for(let i=0;i<this.hotTableComponent.current.hotInstance.getSourceData().length;i++) {
  //       //console.log(this.hotTableComponent.current.hotInstance.getDataAtRowProp(i,'id'))     
        
  //       //if multiple page, validation use API - connect to Database
  //       // console.log("CHECK GET SOURCE DATA")
  //       // console.log(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(i))
  //       if(this.state.selRow==0) { 
  //         //if(this.hotTableComponent.current.hotInstance.getDataAtRowProp(i,'username')==value) {
  //         if(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(i)['username']==value) {
  //             _ctrExact++
  //         }
  //       } else {
  //         //if(this.hotTableComponent.current.hotInstance.getDataAtRowProp(i,'username')==value&&this.hotTableComponent.current.hotInstance.getDataAtRowProp(i,'id')!=this.state.id) {
  //         if(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(i)['username']==value&&this.hotTableComponent.current.hotInstance.getSourceDataAtRow(i)['id']!=this.state.id) {
  //             _ctrExact++
  //         }
  //       }
  //     }
  //     let _limit = 1
  //     if(this.state.selRow==0) { //validation from save button
  //       _limit = 2
  //     } else { //validation on each record: edit modal
  //       _limit = 1
  //     }
  //     if(value==null||value==undefined) {
  //       this.selRowValidation['username'] = "Username must be filled."
  //       response.valid = false
  //       response.message = 'Username must be filled.'
  //     } else if(value=="") {

  //       this.selRowValidation['username'] = "Username must be filled."
  //       response.valid = false
  //       response.message = 'Username must be filled.'
  //     } else if(_ctrExact>=_limit) {
  //       this.selRowValidation['username'] = "Duplicated username."
  //       response.valid = false
  //       response.message = 'Duplicated username.'
  //     } else response.valid = true
  //   } else if(name=='password') {
  //     if(value==null||value==undefined) {

  //       this.selRowValidation['password'] = "Password must be filled"
  //       response.valid = false
  //       response.message = 'Password must be filled.'
  //     } else if(value=="") {

  //       this.selRowValidation['password'] = "Password must be filled"
  //       response.valid = false
  //       response.message = 'Password must be filled.'
  //     } else response.valid = true
  //   } else if(name=='roleid') {
  //     if(value==null||value==undefined) {

  //       this.selRowValidation['roleid'] = "Role ID must be filled"
  //       response.valid = false
  //       response.message = 'Role ID must be filled.'
  //     } else if(value=="") {

  //       this.selRowValidation['roleid'] = "Role ID must be filled"
  //       response.valid = false
  //       response.message = 'Role ID must be filled.'
  //     } else response.valid = true
  //   } else {
  //     response.valid = true
  //   }
  //   // console.log(this.selRowValidation[this.hotTableComponent.current.hotInstance.getCellMeta(0,0).prop])
  //   return response
  // }
  // usernameValidator = (value, callback) => {
  //   // console.log("usernameValidator")
  //   callback(this.basicValidator('username',value).valid)
  // }
  
  // passwordValidator = (value, callback) => {
  //   // console.log("passwordValidator")
  //   callback(this.basicValidator('password',value).valid)
  // }
  // roleidValidator = (value, callback) => {
  //   // console.log("roleidValidator")
  //   callback(this.basicValidator('roleid',value).valid)
  // }
  // tableSave = () => { //Save changes
  //   console.log(this.state.selRow)
  //   this.setState({
  //     saveClicked : true
  //   },() => {
  //     this.hotTableComponent.current.hotInstance.updateSettings({
  //       columns: this.cols
  //     });
  //     this.hotTableComponent.current.hotInstance.getPlugin('filters').clearConditions()
  //     this.hotTableComponent.current.hotInstance.getPlugin('filters').disablePlugin()

  //     this.hotTableComponent.current.hotInstance.validateColumns([0,1,2,3,4],(valid) => {
  //       if (valid) {
  //         // ... code for validated columns
  //         API.post("/api/credential/user/put", null, {
  //           params: {
  //             data: this.dataChanges,//this.hotTableComponent.current.hotInstance.getSourceData(),
  //             len: this.hotTableComponent.current.hotInstance.getSourceData().length
  //           }
  //         }).then(data => {
  //           // console.log(data);
  //           this.dataChanges = []

  //           this.setState({
  //             btnEdit: true,
  //             btnSave: false,
  //             saveClicked: false
  //           }, () => {
              
              
  //           })
  //         });
  //         for(let i=0;i<this.cols.length;i++) {
  //           this.cols[i].readOnly = true;
  //         }
  //       } else {
  //         alert("Invalid!");
  //       }
  //     })
  //   })
  // }
  tableFilter = () => {
    if(this.state.filterOpen){
      this.setState({
        filterOpen:false,
      })
    }else{
      this.setState({
        filterOpen:true,
      })
    }
  }
  // tableFilter = () => { //Turn on/off filter
  //   this.setState({
  //     btnFilter: !this.state.btnFilter
  //   }, () => {
      
  //     if(this.state.btnFilter) {
  //       this.hotSettings.afterGetColHeader = this.addInput;
  //       this.hotSettings.beforeOnCellMouseDown = this.doNotSelectColumn;
  //       this.hotSettings.columnHeaderHeight = 52
  //       this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)  
  //     } else {
  //       this.removeInput()
  //       this.hotSettings.colHeaders = this.colsHeader
  //       delete this.hotSettings.afterGetColHeader;
  //       delete this.hotSettings.beforeOnCellMouseDown
  //       this.hotSettings.columnHeaderHeight = 25
  //       this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)
        
  //     }
  //   })
  // }
  // tableReset = () => { //Rollback changes
    
  //   this.getUserData();
  //   this.dataChanges = []
  //   this.setState({
  //     btnEdit: true,
  //     btnSave: false,
  //     saveClicked: false
  //   }, () => {
  //     for(let i=0;i<this.cols.length;i++) {
  //       this.cols[i].readOnly = true;
  //     }
  //     this.hotSettings.columns = this.cols;
  //     this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)
  //   })
  // }
  // tableEdit = () => { //Turn edit mode on
  //   this.setState({
  //     btnEdit: false,
  //     btnSave: true
  //   }, () => {
  //     for(let i=0;i<this.cols.length;i++) {
  //       this.cols[i].readOnly = false;
  //     }
  //     this.hotSettings.columns = this.cols;
  //     this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)
      
  //   })
  // }
  s2ab = (s)=> { 
    // var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(s);  //create uint8array as viewer
    // for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return view;    
}
  tableDownload = () => { //download
    let token = localStorage.getItem('id_token');
    axios.post('http://34.101.137.61:22112/credential_service/download_excel', { 
      responseType: 'arraybuffer' , 
   
        key:token,
        data:'user'
      
      })
      .then((response) => {
        saveAs(new Blob([new Uint8Array(response.data.file_excel.data)],{type:"application/octet-stream"}), 'user.xlsx');
      });
    
   
      // API.post("download_excel",{
       
      //     key: token,
      //     data:"user",
       
      //     responseType: 'blob'
      // }
      //   // headers:
      //   //     {
      //   //         'Content-Disposition': "attachment; filename=template.xlsx",
      //   //         'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      //   //     }
      //   //   }    
      // ).then(response=> {
      //     console.log(response.data.file_excel.data.length)
      //     // console.log(response.data.file_excel.data.charCodeAt(0))
      //     // const url = window.URL.createObjectURL(new Blob([response.data.file_excel.data],{type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"}));
      //     // console.log(url)         
      //     // const buf = new ArrayBuffer(response.data.file_excel.data.length);
      // // const view = new Uint8Array(buf);
      // // for (let i = 0; i != response.data.file_excel.data.length; ++i) view[i] = response.data.file_excel.data.charCodeAt(i) & 0xFF;
      // const blob = new Blob([response.data.file_excel.data], {
      //   type: 'application/octet-stream'
      // });
      // const a = window.document.createElement('a');
      // a.href = window.URL.createObjectURL(blob, {
      //   type: 'data:attachment/xlsx'
      // });
      // a.download = 'yourFileName.xlsx';
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // Automatically download the file by appending an a element,
      // 'clicking' it, and removing the element
      // const a = window.document.createElement('a');
      // a.href = window.URL.createObjectURL(blob, {
      //   type: 'data:attachment/xlsx'
      // });
      // a.download = 'yourFileName.xlsx';
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
          // saveAs(url, "user.xlsx");
      // })
        
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'template.xlsx');
        // document.body.appendChild(link);
        // link.click();




        //window.open('http://localhost:3001/api/credential/user/download/excel', "_blank")
        // fetch('http://localhost:3001/api/credential/user/download/excel')
        // this.setState({
        //   dataSet: data.data.data
        // });
		// 	.then(response => {
		// 		response.blob().then(blob => {
		// 			let url = window.URL.createObjectURL(blob);
		// 			let a = document.createElement('a');
		// 			a.href = url;
		// 			a.download = 'user.xlsx';
		// 			a.click();
		// 		});
    // });
    


  }
  // handleChange = (e) => {
  //   let _valid = e.target.name+'valid'
  //   let _invalid = e.target.name+'invalid'
  //   let _invalidmsg = e.target.name+'invalidmsg'

  //   //basicValidator(e.target.value)
  //   let validation = this.basicValidator(e.target.name,e.target.value)
  //   this.setState(
  //       {
  //         [e.target.name]: e.target.value,
  //         [_valid]: validation.valid,
  //         [_invalid]: !validation.valid,
  //         [_invalidmsg]: validation.message
  //       }, () => { 
          
  //       }
  //   )
  // }
  // getUserDept = (id,i) => {  //on startup function
  //   let token = localStorage.getItem('id_token');
   
  //   API.post("get_department",{
  //     key: token,
  //     dept_id: id,
  //     info_data:'detail'
  //   }
    
  //   ).then(data => {
      
  //     let u = data.data.data.dept_name;
  //     this.setState(prevState => ({
  //       dept: [...prevState.dept, u]
  //     }))
  //     // this.setState({
  //     //   dataSet: data.data.data
  //     // });
    
  //   })
  // }
  renderAll = (data)=>{
      this.setState({
        loading:true,
      })
      this.setState({
        dataSet:data,
        loading:false
      })
      
    
  }
  // getUserBranch = (id,i) => {  //on startup function
  //   let token = localStorage.getItem('id_token');
   
  //   API.post("get_branch",{
  //     key: token,
  //     branch_id: id,
  //     info_data:'detail'
  //   }
    
  //   ).then(data => {
      
  //     let u = data.data.data.branch_name;
  //     this.setState(prevState => ({
  //       branch: [...prevState.branch, u]
  //     }))
  //     // this.setState({
  //     //   dataSet: data.data.data
  //     // });
    
  //   })
  // }
  // getUserGroup = (id,i) => {  //on startup function
  //   let token = localStorage.getItem('id_token');
   
  //   API.post("get_group",{
  //     key: token,
  //     group_id: id,
  //     info_data:'detail'
  //   }
    
  //   ).then(data => {
      
  //     let u = data.data.data.group_name;
     
  //     this.setState(prevState => ({
  //       group: [...prevState.group, u]
  //     }))
  //     // this.setState({
  //     //   dataSet: data.data.data
  //     // });
    
  //   })
  // }
  // getUserRole = (id,i) => {  //on startup function
  //   let token = localStorage.getItem('id_token');
   
  //   API.post("get_role",{
  //     key: token,
  //     role_id: id,
  //     info_role:'detail'
  //   }
    
  //   ).then(data => {
      
  //     let u = data.data.data.role_name;
  //     // console.log(data.data.data)
  //     this.setState(prevState => ({
  //       role: [...prevState.role, u]
  //     }))
  //     // this.setState({
  //     //   dataSet: data.data.data
  //     // });
    
  //   })
  // }
  getUserData = (jumlah, halaman) => {  //on startup function
    let token = localStorage.getItem('id_token');
    this.setState({
      loading:true,
    })
    API.post("get_user",{
      key: token,
      info_data:'all',
      per_page:jumlah,
      page:halaman
    }
    
    ).then(data => {
     
      this.setState({
        dataSet: data.data.data,
        jumlah:data.data.count_data,
        schema:Object.keys(data.data.data[0]),
        dataFilter:data.data.field_filter_name,
        schema1:Object.keys(data.data.field_filter_name[0]),
        loading:false
      });
     
      // for(let i=0;i<data.data.data.length;i++){
      //   this.getUserDept(data.data.data[0].dept_id,i);
      //   this.getUserRole(data.data.data[0].role_id,i);
      //   this.getUserGroup(data.data.data[0].group_id,i);
      //   this.getUserBranch(data.data.data[0].branch_id,i);
  
      // }
    })
    
  }
  
  // getOptionData = () => {  //on startup function
  //   let token = localStorage.getItem('id_token');
  //   API.post("/credential_service/get_user",{
  //     key: token,
  //     userId: '1'
  //   }).then(data => {
  //     // console.log(data.data.data);
      
    
  //     // this.cols[1].source = data.data.data[0].role_id

    
      
  //     // this.hotSettings.columns = this.cols;
  //     // this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)

  //   })
  // }
  // getUserColWidth = () => {  //on startup function
  //   API.get("/credential-service/user/preference/get?page=user&component=colWidths").then(data => {
    
  //     this.colsWidth = JSON.parse(data.data.preference)

  //     this.hotSettings.colWidths = this.colsWidth;
  //     this.hotSettings.width = '100%'
  //     this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)
  //   })
  // }
  // rowInsert = () => {  //add row
  //   let _tempLength = this.hotTableComponent.current.hotInstance.getData().length
  
  //   this.setState(prevState => ({
  //     irnumber: prevState.irnumber+1
  //   }),() => {
  //     this.hotTableComponent.current.hotInstance.alter('insert_row', _tempLength)
  //     this.hotTableComponent.current.hotInstance.setDataAtCell(_tempLength,1,this.state.irnumber,'IR')
  //   })
  // }
     rowAdd = () => {  //edit row
          this.setState({
            isOpen:true,
            actionForm:"ADD USER"
          })
          this.props.membuka();
     }
     rowEdit = () => {  //edit row
      this.setState({
        isOpen:true,
        actionForm:"EDIT USER"
      })
      this.props.membuka();
      
 }
 rowChangePass = () => {  //edit row
  this.setState({
    isOpen:true,
    actionForm:"CHANGE PASS"
  })
  this.props.membuka();
 }
 
  // rowEdit = () => {  //edit row
  //   if(this.hotTableComponent.current.hotInstance.getSelected()==undefined) {
  //     alert("Please select 1 row")
  //   } else if(this.hotTableComponent.current.hotInstance.getSelected().length>1) {
  //     alert("Only 1 row(s) allowed")
  //   } else if(this.hotTableComponent.current.hotInstance.getSelected()[0][0]!=this.hotTableComponent.current.hotInstance.getSelected()[0][2]) {
  //     alert("Only 1 row(s) allowed")
  //   } else {
  //     //console.log(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0]))
  //     // console.log(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0]))
  //     // console.log(this.hotTableComponent.current.hotInstance.getDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0])) 

  //     this.selRowData = this.hotTableComponent.current.hotInstance.getDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0])
  //     let _tempState = {}
  //     let _valid, _invalid, _invalidmsg
  //     for(let i=0;i<this.cols.length;i++) {
  //       _valid = this.cols[i].data+'valid'
  //       _invalid = this.cols[i].data+'invalid'
  //       _invalidmsg = this.cols[i].data+'invalidmsg'
        
  //       _tempState[this.cols[i].data] = this.hotTableComponent.current.hotInstance.getDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0])[i]
  //       _tempState[_valid] = false
  //       _tempState[_invalid] = false
  //       _tempState[_invalidmsg] = null
  //     }
  //     _tempState.modalEdit = !this.state.modalEdit
  //     _tempState.selRow = this.hotTableComponent.current.hotInstance.getSelected()[0][0]+1
  //     // _tempState.selRow = this.hotTableComponent.current.hotInstance.getDataAtCell(this.hotTableComponent.current.hotInstance.getSelected()[0][0],0)
  //     //console.log(this.hotTableComponent.current.hotInstance.getDataAtCell(this.hotTableComponent.current.hotInstance.getSelected()[0][0],0))
  //     this.setState(
  //       _tempState
  //     , () => {
  //       for(let i=2;i<this.cols.length;i++) {
  //         this.cols[i].readOnly = false;
  //       }
  //     })
  //   }
  // }
 
  rowDelete = (e) => {  //delete row

  let hasil = "";
var fetches = [];
    for(let i=0;i<this.props.jumlah.selectedId.length;i++){
      let token = localStorage.getItem('id_token');
   
      fetches.push(API.post("delete_user",{
        key: token,
        userId: this.props.jumlah.selectedId[i]
      }).then(data => {
       hasil = hasil + "User ID "+this.props.jumlah.selectedId[i]+" "+data.data.data +"\n";
      
    }));
  
    
  }

  Promise.all(fetches).then(function() {
    alert(hasil);
    
    
  }).then(()=>{
    this.getUserData(this.props.perpage.jumlah,this.props.perpage.halaman );
  });
}
  // editRowCancel = () => {  //edit row cancel button
  //   this.setState({
  //     modalAction: 'editcancel'
  //   }, () => {
  //     let _tempSelRowData = Object.assign([], this.hotTableComponent.current.hotInstance.getSourceData())
  //     _tempSelRowData[this.state.selRow-1] = Object.assign({}, this.arrayToObject2(this.selRowData))
      
  //     this.hotTableComponent.current.hotInstance.loadData(_tempSelRowData);
  //   })
  // }
  // editRowSave = () => {  //edit row save button
  //   this.setState({
  //     modalAction: 'editsave'
  //   }, () => {
  //     //compare data and push to dataChanges
  //     let _tempSelRowData = Object.assign([], this.hotTableComponent.current.hotInstance.getSourceData())
  //     let _tempChanges = []
  //     let _tempChangesAll = []
  //     //find the correct index by ID and IR
  //     let _newIndex
  //     for(let i=0;i<_tempSelRowData.length;i++) {
  //       if(_tempSelRowData[i]['id']==this.state.id && _tempSelRowData[i]['ir']==this.state.ir) {
  //         _newIndex = i
  //       }
  //     }

  //     for(let i=2;i<this.cols.length;i++) {
  //       if(_tempSelRowData[_newIndex][this.cols[i].data] !== this.state[this.cols[i].data]) {
  //         //push into changes
  //         //[3, "username", null, "newuser_"]
  //         _tempChanges = []
  //         _tempChanges[0] = this.state.selRow-1//this.hotTableComponent.current.hotInstance.getDataAtCell(this.state.selRow-1,0)+'.'+this.hotTableComponent.current.hotInstance.getDataAtCell(this.state.selRow-1,1) //this.state.selRow-1
  //         _tempChanges[1] = this.cols[i].data
  //         _tempChanges[2] = _tempSelRowData[_newIndex][this.cols[i].data]
  //         _tempChanges[3] = this.state[this.cols[i].data]
  //         _tempChanges[4] = _tempSelRowData[_newIndex]['id']
  //         _tempChanges[5] = _tempSelRowData[_newIndex]['ir']
  //         _tempChangesAll.push(_tempChanges)
  //       }
  //     }
  //     console.log(_tempChangesAll)
  //     console.log(this.dataChanges)
  //     let tempObject = {Action:"", RowNumber:null, RecordData:{}}
  //     let isExists = false
      
  //     for(let r=0;r<_tempChangesAll.length;r++) {
  //       isExists = false

  //       for(let i=0;i<this.dataChanges.length;i++) {
  //         console.log(this.dataChanges[i].id)
  //         console.log(_tempChangesAll[r][4])
  //         console.log('==========')
  //         //if(this.dataChanges[i].RowNumber==_tempChangesAll[r][0]) {
  //         if(this.dataChanges[i].id==_tempChangesAll[r][4]&&this.dataChanges[i].ir==_tempChangesAll[r][5]) {
  //             isExists = true
  //         //tempObject.RecordData[changes[0][1]] = changes[0][3]
  //         this.dataChanges[i].RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
  //         }
  //       }
        
  //       if(isExists == false) {
  //         if(_tempChangesAll[r][4]==undefined||_tempChangesAll[r][4]==null) { //if(_tempChangesAll[r][2]==undefined) { //new record
  //           tempObject.Action = 'I'
  //           tempObject.id = _tempChangesAll[r][4]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],0)
  //           tempObject.ir = _tempChangesAll[r][5]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],1)
  //           tempObject.RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
  //         } else { //update record
  //           tempObject.Action = 'U'
  //           tempObject.id = _tempChangesAll[r][4]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],0)
  //           tempObject.ir = _tempChangesAll[r][5]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],1)
  //           tempObject.RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
  //         }
  //         this.dataChanges.push(tempObject)
  //       }
  //     }

  //     //first approach : using datasource replacement
  //     //_tempSelRowData = Object.assign([], this.hotTableComponent.current.hotInstance.getSourceData())
      

  //     for(let i=0;i<this.cols.length;i++) {
  //       _tempSelRowData[_newIndex][this.cols[i].data] = this.state[this.cols[i].data]
  //       //validate
  //       let _valid = this.cols[i].data+'valid'
  //       let _invalid = this.cols[i].data+'invalid'
  //       let _invalidmsg = this.cols[i].data+'invalidmsg'
  //       let validation = this.basicValidator(this.cols[i].data,this.state[this.cols[i].data])
  //       this.setState(
  //         {
  //           [_valid]: validation.valid,
  //           [_invalid]: !validation.valid,
  //           [_invalidmsg]: validation.message
  //         }, () => { 
            
  //         }
  //       )
  //     }
  //     this.hotTableComponent.current.hotInstance.loadData(_tempSelRowData)
  //   })
  // }
  // componentDidMount() {
  //   this.getUserData()
  // }
  componentWillMount() {
    this.props.kirimSelected();
    console.log(this.props.MenuAcces)
    if(this.props.MenuAcces.menu){
      let cuyaja = this.props.MenuAcces.menu;
      for(const key of cuyaja){
       
        if(key.name=="user"){
         
            this.setState({
              menuAcces:{ 
                access_view:(key.access_view === 'true'),
                access_create:(key.access_create === 'true'),
                access_update:(key.access_update === 'true'),
                access_delete:(key.access_delete === 'true')
              }
            })
        }
      }
    }
    Promise.all([
      // // Promise.resolve(this.getUserColWidth()),
      // Promise.resolve(this.getOptionData()),
      Promise.resolve(this.getUserData(this.props.perpage.jumlah,this.props.perpage.halaman)) 
    ]).then(values => {
      console.log("ALL COMPLETED")
      console.log(values)
    })
   
    
   }
  
  
  onChange = (immutableTree, config) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    this.setState({tree: immutableTree, config: config});

    const jsonTree = QbUtils.getTree(immutableTree);
    console.log(jsonTree);
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  }
  componentDidUpdate(prevProps, prevState, ss){
    // console.log(this.state.dept[0])
    console.log(this.state.menuAcces.access_create)    
    
    
    if(prevState.isOpen!==this.props.terbuka.isOpen || prevState.perpage!==this.props.perpage.jumlah || prevState.halaman!==this.props.perpage.halaman){
      this.getUserData(this.props.perpage.jumlah,this.props.perpage.halaman);
    
      this.setState({
        isOpen :this.props.terbuka.isOpen,
        perpage:this.props.perpage.jumlah,
        halaman:this.props.perpage.halaman
      })
  

    }
    // if(prevState.dataSet!=this.state.dataSet){
        
    // }
    // console.log(this.props.jumlah)
  }

  
  
  render() { 
    const { file } = this.state;
    return (
      <div id="hot-app" style={{marginTop:'-22px'}}>
         
          {this.state.loading==false ?
          <div>          {this.state.menuAcces.access_create && this.state.menuAcces.access_create==true ?
          
          <Tooltip title="Add User" aria-label="Add User">
            <Button  id="btnRowAdd" className="btn-pill btn-outline-dark btn-m" style={{fontSize:'20px'}} onClick={this.rowAdd}><i className="fa fa-plus-square"></i></Button>

          </Tooltip>
          
          :""}
       
            {this.props.jumlah.selectedUser>0 &&  this.state.menuAcces.access_delete==true?   <Tooltip title="Delete User" aria-label="Delete User"><Button  id="btnRowDelete" className="btn-pill btn-outline-danger btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={this.rowDelete}><i className="fa fa-window-close"></i></Button></Tooltip>:''}

       
       
            {this.props.jumlah.selectedUser==1  && this.state.menuAcces.access_update==true?   <Tooltip title="Edit User" aria-label="Edit User"><Button color="warning" id="btnTableEdit" className="btn-pill btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={this.rowEdit}><i className="fa fa-edit"></i></Button></Tooltip> : null}
            {this.props.jumlah.selectedUser==1  && this.state.menuAcces.access_update==true?   <Tooltip title="Change Password" aria-label="Change Password"><Button color="success" id="btnTableEdit" className="btn-pill btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={this.rowChangePass}><i className="fa fa-key"></i></Button></Tooltip> : null}

          

        

          {/* {this.state.btnSave ? <Button color="secondary" id="btnTableEditReset" className="btn-pill" onClick={this.tableReset}><i className="fa fa-undo"></i>&nbsp;<span>Cancel</span></Button> : null} */}
          {/* {this.state.btnSave ? <Button color="success" id="btnTableEditSave" className="btn-pill" onClick={this.tableSave}>&nbsp;&nbsp;<i className="fa fa-save"></i>&nbsp;<span>Save</span>&nbsp;&nbsp;</Button> : null} */}
          {/* {this.state.btnSave ? <Button color="dark" id="btnRowAdd" className="btn-pill" onClick={this.rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button> : null} */}
          {/* {this.state.btnSave ? <Button color="dark" id="btnRowEdit" className="btn-pill" onClick={this.rowEdit}>&nbsp;&nbsp;<i className="fa fa-pencil-square"></i>&nbsp;<span>Edit&nbsp;&nbsp;</span></Button> : null} */}
          {/* {this.state.btnSave ? <Button color="dark" id="btnRowDelete" className="btn-pill" onClick={this.rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button> : null} */}
          {/* {this.state.btnSave ? <Button color="primary" id="btnRowInsert" className="btn-pill" onClick={this.toggleModalInsert}>&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-clone"></i>&nbsp;<span>Insert&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null} */}
          
         
          <Tooltip title="Filter User" aria-label="Filter User"><Button  id="btnFilter"  className="btn-pill btn-outline-light btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={this.tableFilter}><i className="fa fa-filter"></i></Button></Tooltip>
          <Tooltip title="Download User" aria-label="Download User"><Button  id="btnDownload"  className="btn-pill btn-outline-info btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={this.tableDownload}><i className="fa fa-cloud-download"></i></Button></Tooltip>
         
          {/* <Tooltip  title="Download User" aria-label="Download User"> <Button style={{fontSize:'20px', marginLeft:'5px'}}  id="btnTableDownload"  className="btn-pill btn-outline-info btn-m" onClick={this.tableDownload}><i className="fa fa-cloud-download" ></i></Button></Tooltip> */}
            {/* <Button color="info" id="btnTableUpload"  className="btn-pill" onClick={this.tableDownload}><i className="fa fa-cloud-download"></i>&nbsp;<span>Download</span></Button> */}

          
          {/* <a href={`http://localhost:3001/api/credential/user/download/excel`} >Download</a> */}
          <Modal isOpen={this.state.modalEdit} toggle={this.toggleModalEdit}
                  className={'modal-lg ' + this.props.className}>
            <ModalBody>
              <Card>
                <CardHeader>
                  <strong>Edit Form</strong> Record #{this.state.selRow} 
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                    <FormGroup row>
                      <Col md="2">
                        <Label>Username</Label>
                      </Col>
                      <Col xs="12" md="10">
                        <Input type="text" id="username" name="username" valid={this.state['usernamevalid']} invalid={this.state['usernameinvalid']} placeholder="Please input username" value={this.state.username}  onChange={this.handleChange} />
                        <FormFeedback>{this.state['usernameinvalidmsg']}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="text-input">Password</Label>
                      </Col>
                      <Col xs="12" md="10">
                        <Input type="password" id="password" name="password" valid={this.state['passwordvalid']} invalid={this.state['passwordinvalid']} placeholder="Please input password" value={this.state.password}  onChange={this.handleChange} />
                        <FormFeedback>{this.state['passwordinvalidmsg']}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="select">Role ID</Label>
                      </Col>
                      <Col xs="12" md="10">
                        <Input type="select" name="roleid" valid={this.state['roleidvalid']} invalid={this.state['roleidinvalid']} id="roleid" value={this.state.roleid} onChange={this.handleChange}>                        
                          <option value="">Please select</option>
                          {this.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.value} - {option.desc}
                            </option>
                          ))}
                        </Input>  
                        <FormFeedback>{this.state['roleidinvalidmsg']}</FormFeedback>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter align="right">
                  <Button color="secondary" onClick={this.editRowCancel}><i className="fa fa-close"></i>&nbsp;Cancel</Button>&nbsp;
                  <Button color="primary" onClick={this.editRowSave}>&nbsp;<i className="fa fa-arrow-right"></i>&nbsp;Next&nbsp;</Button>{' '}
                </CardFooter>
              </Card>
            </ModalBody>
          </Modal>

          <Modal isOpen={this.state.modalAdd} toggle={this.toggleModalAdd}
                  className={'modal-lg ' + this.props.className}>
            <ModalBody>
              <Card>
                <CardHeader>
                  <strong>Add Form</strong>
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                    <FormGroup row>
                      <Col md="2">
                        <Label>Username</Label>
                      </Col>
                      <Col xs="12" md="10">
                        <Input type="text" id="username" name="username" valid={this.state['usernamevalid']} invalid={this.state['usernameinvalid']} placeholder="Please input username" value={this.state.username}  onChange={this.handleChange} />
                        <FormFeedback>{this.state['usernameinvalidmsg']}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="text-input">Password</Label>
                      </Col>
                      <Col xs="12" md="10">
                        <Input type="password" id="password" name="password" valid={this.state['passwordvalid']} invalid={this.state['passwordinvalid']} placeholder="Please input password" value={this.state.password}  onChange={this.handleChange} />
                        <FormFeedback>{this.state['passwordinvalidmsg']}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="select">Role ID</Label>
                      </Col>
                      <Col xs="12" md="10">
                        <Input type="select" name="roleid" valid={this.state['roleidvalid']} invalid={this.state['roleidinvalid']} id="roleid" value={this.state.roleid} onChange={this.handleChange}>                        
                          <option value="">Please select</option>
                          {this.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.value} - {option.desc}
                            </option>
                          ))}
                        </Input>  
                        <FormFeedback>{this.state['roleidinvalidmsg']}</FormFeedback>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter align="right">
                  <Button color="secondary" onClick={this.addRowCancel}><i className="fa fa-close"></i>&nbsp;Cancel</Button>&nbsp;
                  <Button color="primary" onClick={this.addRowSave}>&nbsp;<i className="fa fa-arrow-right"></i>&nbsp;Next&nbsp;</Button>{' '}
                </CardFooter>
              </Card>
            </ModalBody>
          </Modal>

          <Modal isOpen={this.state.modalInsert} toggle={this.toggleModalInsert}
                  className={'modal-xs ' + this.props.className}>
            <ModalBody>
              <Card>
                <CardBody>
                  <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                    <FormGroup row>
                      <Col md="3">
                        <Label>Insert Row </Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="rows" name="rows" valid={this.state['rowsvalid']} invalid={this.state['rowsinvalid']} value={this.state.rows} onChange={this.handleChange} />
                        <FormFeedback>{this.state['rowsinvalidmsg']}</FormFeedback>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter align="right">
                  <Button color="secondary" onClick={this.insertRowCancel}><i className="fa fa-close"></i>&nbsp;Cancel</Button>&nbsp;
                  <Button color="primary" onClick={this.insertRowSave}>&nbsp;<i className="fa fa-arrow-right"></i>&nbsp;Next&nbsp;</Button>{' '}
                </CardFooter>
              </Card>
            </ModalBody>
          </Modal>

                        {this.state.filterOpen? 
                        
                        <Card>
                            <CardHeader><strong><i className="fa fa-filter"></i>&nbsp;Source Filter</strong></CardHeader>
                            <CardBody bodystyle={{padding: "0"}}>
                                <Filterdata data={this.state.dataFilter} name={"user"} onClick={this.renderAll} schema={this.state.schema1} name="user" jumlahdata={this.state.jumlah} deptName={[...this.state.dept]}  roleName={[...this.state.role]} groupName={[...this.state.group]}></Filterdata>
                                {/* <QueryBuilder fields={fields} operators={operators} /> */}
                                {/* <QueryBuilderComponent /> */}
                                {/* <Query 
                                   
                                ></Query> */}
                                  {/* <Query 
                                    {...BasicConfig}{...fields}
                                    value={loadTree(this.state.initValue)}
                                    get_children={this.getChildren}
                                    onChange={this.changes}
                                ></Query> */}

                            
                            </CardBody>
                        </Card>

                        :'' }


        <Table data={this.state.dataSet} schema={this.state.schema} name="user" jumlahdata={this.state.jumlah} deptName={[...this.state.dept]} branchName={[...this.state.branch]}  roleName={[...this.state.role]} groupName={[...this.state.group]}/>
        <Dialog open={this.state.isOpen} actionForm={this.state.actionForm}></Dialog>
          {/* <HotTable ref={this.hotTableComponent} id="hot2" settings={this.hotSettings} licenseKey="non-commercial-and-evaluation" /> */}
          </div>

      :<Skeleton></Skeleton>}
        </div>
    )
    
  }

}





export default connect(userSelected1,mapDispatchToProps )(UserView);




