import React, { Component } from 'react';
import { Button, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader, Form,
  FormGroup,
  FormText, FormFeedback, 
  Card,
  CardBody,
  CardFooter,
  CardHeader,Label,Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText } from 'reactstrap'

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import API from 'api';
import decode from 'jwt-decode';

class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnEdit : true,
      btnSave : false,
      btnFilter : false,
      saveClicked : false,
      
      modalEdit: false,
      modalAdd: false,
      modalInsert: false,

      selRow: 0,
      rows: 1,

      modalAction : '',

      isvalid : true,
      irnumber: 0,
      editStart: false
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
      afterChange: (changes,source) => {
        // this.setState({
        //   selRow: 0
        // }, () => {
          if (source == 'loadData') {
            if(this.state.modalAction=='editsave') {
              this.hotTableComponent.current.hotInstance.validateRows([this.state.selRow-1], (valid) => {
                if (valid) {
                  this.setState({
                    modalEdit: !this.state.modalEdit,
                    modalAction: '',
                    selRow: 0
                  }, () => {
                    for(let i=0;i<this.cols.length;i++) {
                      this.cols[i].readOnly = false;
                    }
                  })
                } else {
                  alert('Invalid!')
                  //this.hotTableComponent.current.hotInstance.setDataAtRowProp(this.state.selRow-1,0,_tempSelRowData)
                  
                }
              })
            } else if(this.state.modalAction=='editcancel') {
              this.setState({
                modalEdit: !this.state.modalEdit,
                modalAction: '',
                selRow: 0
              }, () => {
                for(let i=0;i<this.cols.length;i++) {
                  this.cols[i].readOnly = false;
                }
                
              })
            } 
            // else if(this.state.modalAction=='addsave') {
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
          } else if (source !== 'loadData' && source!='IR' && source!='edit') {
            this.hotTableComponent.current.hotInstance.updateSettings({
              columns: this.cols,
            });
          }
        // })
      },
      afterValidate: (isValid, value, row, prop, source) => {
        if(isValid==false) {
          const commentsPlugin = this.hotTableComponent.current.hotInstance.getPlugin('comments');

          // Manage comments programmatically:
          commentsPlugin.setCommentAtCell(row, this.hotTableComponent.current.hotInstance.propToCol(prop), this.selRowValidation[prop]);
          
        }
      }
    };
    this.hotTableComponent = React.createRef();
  }
  basicValidator = (name,value) => {
    let _ctrExact = 0
    let response = {}
    
    if(name=='username') {
      //console.log(this.state.id+" : "+this.hotTableComponent.current.hotInstance.getDataAtRowProp(this.state.selRow-1,'id'))
      
      for(let i=0;i<this.hotTableComponent.current.hotInstance.getSourceData().length;i++) {
        //console.log(this.hotTableComponent.current.hotInstance.getDataAtRowProp(i,'id'))     
        
        //if multiple page, validation use API - connect to Database
        // console.log("CHECK GET SOURCE DATA")
        // console.log(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(i))
        if(this.state.selRow==0) { 
          //if(this.hotTableComponent.current.hotInstance.getDataAtRowProp(i,'username')==value) {
          if(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(i)['username']==value) {
              _ctrExact++
          }
        } else {
          //if(this.hotTableComponent.current.hotInstance.getDataAtRowProp(i,'username')==value&&this.hotTableComponent.current.hotInstance.getDataAtRowProp(i,'id')!=this.state.id) {
          if(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(i)['username']==value&&this.hotTableComponent.current.hotInstance.getSourceDataAtRow(i)['id']!=this.state.id) {
              _ctrExact++
          }
        }
      }
      let _limit = 1
      if(this.state.selRow==0) { //validation from save button
        _limit = 2
      } else { //validation on each record: edit modal
        _limit = 1
      }
      if(value==null||value==undefined) {
        this.selRowValidation['username'] = "Username must be filled."
        response.valid = false
        response.message = 'Username must be filled.'
      } else if(value=="") {

        this.selRowValidation['username'] = "Username must be filled."
        response.valid = false
        response.message = 'Username must be filled.'
      } else if(_ctrExact>=_limit) {
        this.selRowValidation['username'] = "Duplicated username."
        response.valid = false
        response.message = 'Duplicated username.'
      } else response.valid = true
    } else if(name=='password') {
      if(value==null||value==undefined) {

        this.selRowValidation['password'] = "Password must be filled"
        response.valid = false
        response.message = 'Password must be filled.'
      } else if(value=="") {

        this.selRowValidation['password'] = "Password must be filled"
        response.valid = false
        response.message = 'Password must be filled.'
      } else response.valid = true
    } else if(name=='roleid') {
      if(value==null||value==undefined) {

        this.selRowValidation['roleid'] = "Role ID must be filled"
        response.valid = false
        response.message = 'Role ID must be filled.'
      } else if(value=="") {

        this.selRowValidation['roleid'] = "Role ID must be filled"
        response.valid = false
        response.message = 'Role ID must be filled.'
      } else response.valid = true
    } else {
      response.valid = true
    }
    // console.log(this.selRowValidation[this.hotTableComponent.current.hotInstance.getCellMeta(0,0).prop])
    return response
  }
  usernameValidator = (value, callback) => {
    // console.log("usernameValidator")
    callback(this.basicValidator('username',value).valid)
  }
  passwordValidator = (value, callback) => {
    // console.log("passwordValidator")
    callback(this.basicValidator('password',value).valid)
  }
  roleidValidator = (value, callback) => {
    // console.log("roleidValidator")
    callback(this.basicValidator('roleid',value).valid)
  }
  tableSave = () => { //Save changes
    console.log(this.state.selRow)
    this.setState({
      saveClicked : true
    },() => {
      this.hotTableComponent.current.hotInstance.updateSettings({
        columns: this.cols
      });
      this.hotTableComponent.current.hotInstance.getPlugin('filters').clearConditions()
      this.hotTableComponent.current.hotInstance.getPlugin('filters').disablePlugin()

      this.hotTableComponent.current.hotInstance.validateColumns([0,1,2,3,4],(valid) => {
        if (valid) {
          // ... code for validated columns
          API.post("/api/credential/user/put", null, {
            params: {
              data: this.dataChanges,//this.hotTableComponent.current.hotInstance.getSourceData(),
              len: this.hotTableComponent.current.hotInstance.getSourceData().length
            }
          }).then(data => {
            // console.log(data);
            this.dataChanges = []

            this.setState({
              btnEdit: true,
              btnSave: false,
              saveClicked: false
            }, () => {
              
              
            })
          });
          for(let i=0;i<this.cols.length;i++) {
            this.cols[i].readOnly = true;
          }
        } else {
          alert("Invalid!");
        }
      })
    })
  }
  tableFilter = () => { //Turn on/off filter
    this.setState({
      btnFilter: !this.state.btnFilter
    }, () => {
      
      if(this.state.btnFilter) {
        this.hotSettings.afterGetColHeader = this.addInput;
        this.hotSettings.beforeOnCellMouseDown = this.doNotSelectColumn;
        this.hotSettings.columnHeaderHeight = 52
        this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)  
      } else {
        this.removeInput()
        this.hotSettings.colHeaders = this.colsHeader
        delete this.hotSettings.afterGetColHeader;
        delete this.hotSettings.beforeOnCellMouseDown
        this.hotSettings.columnHeaderHeight = 25
        this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)
        
      }
    })
  }
  tableReset = () => { //Rollback changes
    this.getUserData();
    this.dataChanges = []
    this.setState({
      btnEdit: true,
      btnSave: false,
      saveClicked: false
    }, () => {
      for(let i=0;i<this.cols.length;i++) {
        this.cols[i].readOnly = true;
      }
      this.hotSettings.columns = this.cols;
      this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)
    })
  }
  tableEdit = () => { //Turn edit mode on
    this.setState({
      btnEdit: false,
      btnSave: true
    }, () => {
      for(let i=0;i<this.cols.length;i++) {
        this.cols[i].readOnly = false;
      }
      this.hotSettings.columns = this.cols;
      this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)
      
    })
  }
  tableDownload = () => { //download
    //window.open('http://localhost:3001/api/credential/user/download/excel', "_blank")
    fetch('http://localhost:3001/api/credential/user/download/excel')
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'user.xlsx';
					a.click();
				});
		});
  }
  handleChange = (e) => {
    let _valid = e.target.name+'valid'
    let _invalid = e.target.name+'invalid'
    let _invalidmsg = e.target.name+'invalidmsg'

    //basicValidator(e.target.value)
    let validation = this.basicValidator(e.target.name,e.target.value)
    this.setState(
        {
          [e.target.name]: e.target.value,
          [_valid]: validation.valid,
          [_invalid]: !validation.valid,
          [_invalidmsg]: validation.message
        }, () => { 
          
        }
    )
  }
  
  getUserData = () => {  //on startup function
    API.get("/api/credential/user/get").then(data => {
      this.hotTableComponent.current.hotInstance.loadData(data.data);
    })
  }
  getOptionData = () => {  //on startup function
    API.get("/api/credential/user/option/get").then(data => {
      //console.log(data.data);
      var _temp = []
      var _tempOption = {}
      for(let i=0;i<data.data.role.length;i++) {
        _temp.push(data.data.role[i].roleid)

        _tempOption = {}
        _tempOption['value'] = data.data.role[i].roleid
        _tempOption['desc'] = data.data.role[i].rolename
        this.options.push(_tempOption)
      }
      this.cols[2].source = _temp

      _temp = []
      for(let i=0;i<data.data.role.length;i++) {
        _temp.push(data.data.role[i].roleid+' - '+data.data.role[i].rolename)
      }
      this.colsEdit[4].source = _temp
      
      this.hotSettings.columns = this.cols;
      this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)

    })
  }
  getUserColWidth = () => {  //on startup function
    API.get("/api/credential/user/preference/get?page=user&component=colWidths").then(data => {
    
      this.colsWidth = JSON.parse(data.data.preference)

      this.hotSettings.colWidths = this.colsWidth;
      this.hotSettings.width = '100%'
      this.hotTableComponent.current.hotInstance.updateSettings(this.hotSettings)
    })
  }
  rowInsert = () => {  //add row
    let _tempLength = this.hotTableComponent.current.hotInstance.getData().length
  
    this.setState(prevState => ({
      irnumber: prevState.irnumber+1
    }),() => {
      this.hotTableComponent.current.hotInstance.alter('insert_row', _tempLength)
      this.hotTableComponent.current.hotInstance.setDataAtCell(_tempLength,1,this.state.irnumber,'IR')
    })
  }
  rowAdd = () => {  //edit row
    let _tempState = {}
    let _valid, _invalid, _invalidmsg
    for(let i=0;i<this.cols.length;i++) {
      _valid = this.cols[i].data+'valid'
      _invalid = this.cols[i].data+'invalid'
      _invalidmsg = this.cols[i].data+'invalidmsg'
      
      _tempState[this.cols[i].data] = ''
      _tempState[_valid] = false
      _tempState[_invalid] = false
      _tempState[_invalidmsg] = null
    }
    _tempState.modalAdd = !this.state.modalAdd
    _tempState.selRow = this.hotTableComponent.current.hotInstance.getSourceData()+1

    this.setState(
      _tempState
    , () => {
      // for(let i=2;i<this.cols.length;i++) {
      //   this.cols[i].readOnly = false;
      // }
    })

    // this.setState({
    //   modalAdd : !this.state.modalAdd
    // }, () => {
    
    // })
  }
  rowEdit = () => {  //edit row
    if(this.hotTableComponent.current.hotInstance.getSelected()==undefined) {
      alert("Please select 1 row")
    } else if(this.hotTableComponent.current.hotInstance.getSelected().length>1) {
      alert("Only 1 row(s) allowed")
    } else if(this.hotTableComponent.current.hotInstance.getSelected()[0][0]!=this.hotTableComponent.current.hotInstance.getSelected()[0][2]) {
      alert("Only 1 row(s) allowed")
    } else {
      //console.log(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0]))
      // console.log(this.hotTableComponent.current.hotInstance.getSourceDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0]))
      // console.log(this.hotTableComponent.current.hotInstance.getDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0])) 

      this.selRowData = this.hotTableComponent.current.hotInstance.getDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0])
      let _tempState = {}
      let _valid, _invalid, _invalidmsg
      for(let i=0;i<this.cols.length;i++) {
        _valid = this.cols[i].data+'valid'
        _invalid = this.cols[i].data+'invalid'
        _invalidmsg = this.cols[i].data+'invalidmsg'
        
        _tempState[this.cols[i].data] = this.hotTableComponent.current.hotInstance.getDataAtRow(this.hotTableComponent.current.hotInstance.getSelected()[0][0])[i]
        _tempState[_valid] = false
        _tempState[_invalid] = false
        _tempState[_invalidmsg] = null
      }
      _tempState.modalEdit = !this.state.modalEdit
      _tempState.selRow = this.hotTableComponent.current.hotInstance.getSelected()[0][0]+1
      // _tempState.selRow = this.hotTableComponent.current.hotInstance.getDataAtCell(this.hotTableComponent.current.hotInstance.getSelected()[0][0],0)
      //console.log(this.hotTableComponent.current.hotInstance.getDataAtCell(this.hotTableComponent.current.hotInstance.getSelected()[0][0],0))
      this.setState(
        _tempState
      , () => {
        for(let i=2;i<this.cols.length;i++) {
          this.cols[i].readOnly = false;
        }
      })
    }
  }
  rowDelete = () => {  //delete row
    if(this.hotTableComponent.current.hotInstance.getSelected()==undefined) {
      alert("Please select row")
    } else {
      let _selected = this.hotTableComponent.current.hotInstance.getSelected()
      let _startRow = 0;
      let _endRow = 0;
      let _arrayInstruction = []

      for(let i=0;i<_selected.length;i++) {
        _startRow = _selected[i][0]<=_selected[i][2]?_selected[i][0]:_selected[i][2]
        _endRow = _selected[i][0]<=_selected[i][2]?_selected[i][2]:_selected[i][0]

        let _tempArray = []
        _tempArray[0] = _startRow
        _tempArray[1] = _endRow-_startRow+1
        _arrayInstruction.push(_tempArray)
      }
      this.hotTableComponent.current.hotInstance.alter('remove_row', _arrayInstruction);
    }
  }
  arrayToObject = (input) => {
    let _finalResult = []
    let _tempRow = {}
    for(let i=0;i<input.length;i++) {
      _tempRow = {}
      for(let j=0;j<input[i].length;j++) {
        _tempRow[this.hotTableComponent.current.hotInstance.getCellMeta(0,j).prop] = input[i][j]
      }
      _finalResult.push(_tempRow)
    }
    //console.log(_finalResult)
    return _finalResult
  }
  arrayToObject2 = (input) => {
    let _finalResult = {}
    for(let i=0;i<input.length;i++) {
        _finalResult[this.hotTableComponent.current.hotInstance.getCellMeta(0,i).prop] = input[i]
    }
    //console.log(_finalResult)
    return _finalResult
  }
  editRowCancel = () => {  //edit row cancel button
    this.setState({
      modalAction: 'editcancel'
    }, () => {
      let _tempSelRowData = Object.assign([], this.hotTableComponent.current.hotInstance.getSourceData())
      _tempSelRowData[this.state.selRow-1] = Object.assign({}, this.arrayToObject2(this.selRowData))
      
      this.hotTableComponent.current.hotInstance.loadData(_tempSelRowData);
    })
  }
  editRowSave = () => {  //edit row save button
    this.setState({
      modalAction: 'editsave'
    }, () => {
      //compare data and push to dataChanges
      let _tempSelRowData = Object.assign([], this.hotTableComponent.current.hotInstance.getSourceData())
      let _tempChanges = []
      let _tempChangesAll = []
      //find the correct index by ID and IR
      let _newIndex
      for(let i=0;i<_tempSelRowData.length;i++) {
        if(_tempSelRowData[i]['id']==this.state.id && _tempSelRowData[i]['ir']==this.state.ir) {
          _newIndex = i
        }
      }

      for(let i=2;i<this.cols.length;i++) {
        if(_tempSelRowData[_newIndex][this.cols[i].data] !== this.state[this.cols[i].data]) {
          //push into changes
          //[3, "username", null, "newuser_"]
          _tempChanges = []
          _tempChanges[0] = this.state.selRow-1//this.hotTableComponent.current.hotInstance.getDataAtCell(this.state.selRow-1,0)+'.'+this.hotTableComponent.current.hotInstance.getDataAtCell(this.state.selRow-1,1) //this.state.selRow-1
          _tempChanges[1] = this.cols[i].data
          _tempChanges[2] = _tempSelRowData[_newIndex][this.cols[i].data]
          _tempChanges[3] = this.state[this.cols[i].data]
          _tempChanges[4] = _tempSelRowData[_newIndex]['id']
          _tempChanges[5] = _tempSelRowData[_newIndex]['ir']
          _tempChangesAll.push(_tempChanges)
        }
      }
      console.log(_tempChangesAll)
      console.log(this.dataChanges)
      let tempObject = {Action:"", RowNumber:null, RecordData:{}}
      let isExists = false
      
      for(let r=0;r<_tempChangesAll.length;r++) {
        isExists = false

        for(let i=0;i<this.dataChanges.length;i++) {
          console.log(this.dataChanges[i].id)
          console.log(_tempChangesAll[r][4])
          console.log('==========')
          //if(this.dataChanges[i].RowNumber==_tempChangesAll[r][0]) {
          if(this.dataChanges[i].id==_tempChangesAll[r][4]&&this.dataChanges[i].ir==_tempChangesAll[r][5]) {
              isExists = true
          //tempObject.RecordData[changes[0][1]] = changes[0][3]
          this.dataChanges[i].RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
          }
        }
        
        if(isExists == false) {
          if(_tempChangesAll[r][4]==undefined||_tempChangesAll[r][4]==null) { //if(_tempChangesAll[r][2]==undefined) { //new record
            tempObject.Action = 'I'
            tempObject.id = _tempChangesAll[r][4]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],0)
            tempObject.ir = _tempChangesAll[r][5]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],1)
            tempObject.RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
          } else { //update record
            tempObject.Action = 'U'
            tempObject.id = _tempChangesAll[r][4]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],0)
            tempObject.ir = _tempChangesAll[r][5]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],1)
            tempObject.RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
          }
          this.dataChanges.push(tempObject)
        }
      }

      //first approach : using datasource replacement
      //_tempSelRowData = Object.assign([], this.hotTableComponent.current.hotInstance.getSourceData())
      

      for(let i=0;i<this.cols.length;i++) {
        _tempSelRowData[_newIndex][this.cols[i].data] = this.state[this.cols[i].data]
        //validate
        let _valid = this.cols[i].data+'valid'
        let _invalid = this.cols[i].data+'invalid'
        let _invalidmsg = this.cols[i].data+'invalidmsg'
        let validation = this.basicValidator(this.cols[i].data,this.state[this.cols[i].data])
        this.setState(
          {
            [_valid]: validation.valid,
            [_invalid]: !validation.valid,
            [_invalidmsg]: validation.message
          }, () => { 
            
          }
        )
      }
      this.hotTableComponent.current.hotInstance.loadData(_tempSelRowData)
    })
  }
  componentWillMount() {
    Promise.all([
      Promise.resolve(this.getUserColWidth()),
      Promise.resolve(this.getOptionData()),
      Promise.resolve(this.getUserData()) 
    ]).then(values => {
      console.log("ALL COMPLETED")
      console.log(values)
    })
  }
  toggleModalEdit = () => {
    this.setState({
      modalEdit: !this.state.modalEdit,
    }, () => {
      for(let i=0;i<this.cols.length;i++) {
        this.cols[i].readOnly = false;
      }
    })
  }
  toggleModalAdd = () => {
    this.setState({
      modalAdd: !this.state.modalAdd,
    }, () => {

    })
  }
  toggleModalInsert = () => {
    this.setState({
      modalInsert: !this.state.modalInsert,
    }, () => {

    })
  }
  addRowCancel = () => {  //add row cancel button
    this.setState({
      modalAdd: !this.state.modalAdd
    }, () => {

    })
  }
  addRowSave = () => {  //add row save button
    this.setState(prevState => ({
      irnumber: prevState.irnumber+1
    }),() => {
      //compare data and push to dataChanges
      let _tempSelRowData
      let _tempChanges = []
      let _tempChangesAll = []
      for(let i=0;i<this.cols.length;i++) {
          //push into changes
          //[3, "username", null, "newuser_"]
          _tempChanges = []
          _tempChanges[0] = null//this.hotTableComponent.current.hotInstance.getDataAtCell(this.state.selRow-1,0)+'.'+this.hotTableComponent.current.hotInstance.getDataAtCell(this.state.selRow-1,1) //this.state.selRow-1
          _tempChanges[1] = this.cols[i].data
          _tempChanges[2] = null
          _tempChanges[3] = this.state[this.cols[i].data]
          _tempChanges[4] = ''
          _tempChanges[5] = this.state.irnumber
          _tempChangesAll.push(_tempChanges)
      }
      console.log("TEMP CHANGES ALL")
      console.log(_tempChangesAll)
      let tempObject = {Action:"", RowNumber:null, RecordData:{}}
      let isExists = false
      
      for(let r=0;r<_tempChangesAll.length;r++) {
        isExists = false

        for(let i=0;i<this.dataChanges.length;i++) {
          //if(this.dataChanges[i].RowNumber==_tempChangesAll[r][0]) {
          if(this.dataChanges[i].id==_tempChangesAll[r][4]&&this.dataChanges[i].ir==_tempChangesAll[r][5]) {
            isExists = true
            //tempObject.RecordData[changes[0][1]] = changes[0][3]
            this.dataChanges[i].RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
          }
        }
        
        if(isExists == false) {
          if(_tempChangesAll[r][4]==undefined||_tempChangesAll[r][4]==null||_tempChangesAll[r][4]=='') { //if(_tempChangesAll[r][2]==undefined) { //new record
            tempObject.Action = 'I'
            tempObject.id = _tempChangesAll[r][4]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],0)
            tempObject.ir = _tempChangesAll[r][5]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],1)
            tempObject.RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
          } else { //update record
            tempObject.Action = 'U'
            tempObject.id = _tempChangesAll[r][4]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],0)
            tempObject.ir = _tempChangesAll[r][5]//this.hotTableComponent.current.hotInstance.getDataAtCell(_tempChangesAll[r][0],1)
            tempObject.RecordData[_tempChangesAll[r][1]] = _tempChangesAll[r][3]
          }
          this.dataChanges.push(tempObject)
          console.log("DATA CHANGES")
          console.log(this.dataChanges)
        }
      }

      //first approach : using datasource replacement
      _tempSelRowData = Object.assign([], this.hotTableComponent.current.hotInstance.getSourceData())
      let _tempRow = {}
      let _allValid = true
      console.log(this.state)
      for(let i=0;i<this.cols.length;i++) {
        if(this.cols[i].data=='ir'&&(this.state[this.cols[i].data]==null||this.state[this.cols[i].data]==undefined||this.state[this.cols[i].data]=='')) {
          _tempRow[this.cols[i].data] = this.state.irnumber
        } else {
          _tempRow[this.cols[i].data] = this.state[this.cols[i].data]
        }
        //validate
        let _valid = this.cols[i].data+'valid'
        let _invalid = this.cols[i].data+'invalid'
        let _invalidmsg = this.cols[i].data+'invalidmsg'
        let validation = this.basicValidator(this.cols[i].data,this.state[this.cols[i].data])
        this.setState(
            {
              [_valid]: validation.valid,
              [_invalid]: !validation.valid,
              [_invalidmsg]: validation.message
            }, () => { 
              
            }
        )
        if(validation.valid==false) _allValid=false
      }

      //if all valid
      if(_allValid) {
        this.setState({
          selRow: 0,
          modalAdd: !this.state.modalAdd
        }, () => {
          _tempSelRowData.push(_tempRow)
          this.hotTableComponent.current.hotInstance.loadData(_tempSelRowData)      
        })
      } else {
        //alert('Invalid!')
      }
    })
  }
  insertRowCancel = () => {  //add row cancel button
    this.setState({
      modalInsert: !this.state.modalInsert,
      rows: 1
    }, () => {

    })
  }
  insertRowSave = () => {
    for(let i=0;i<this.state.rows;i++) {
      this.rowInsert()
    }

    this.setState({
      modalInsert: !this.state.modalInsert,
      rows: 1
    }, () => {

    })
  }
  render() {
    const { file } = this.state;
    return (
        <div id="hot-app">
          {this.state.btnEdit ? <Button color="warning" id="btnTableEdit" className="btn-pill" onClick={this.tableEdit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-edit"></i>&nbsp;<span>Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null}
          {this.state.btnEdit ? <Button color="info" id="btnTableDownload"  className="btn-pill" onClick={this.tableDownload}><i className="fa fa-cloud-download"></i>&nbsp;<span>Download</span></Button> : null}

          {this.state.btnSave ? <Button color="secondary" id="btnTableEditReset" className="btn-pill" onClick={this.tableReset}><i className="fa fa-undo"></i>&nbsp;<span>Cancel</span></Button> : null}
          {this.state.btnSave ? <Button color="success" id="btnTableEditSave" className="btn-pill" onClick={this.tableSave}>&nbsp;&nbsp;<i className="fa fa-save"></i>&nbsp;<span>Save</span>&nbsp;&nbsp;</Button> : null}
          {this.state.btnSave ? <Button color="dark" id="btnRowAdd" className="btn-pill" onClick={this.rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button> : null}
          {this.state.btnSave ? <Button color="dark" id="btnRowEdit" className="btn-pill" onClick={this.rowEdit}>&nbsp;&nbsp;<i className="fa fa-pencil-square"></i>&nbsp;<span>Edit&nbsp;&nbsp;</span></Button> : null}
          {this.state.btnSave ? <Button color="dark" id="btnRowDelete" className="btn-pill" onClick={this.rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button> : null}
          {this.state.btnSave ? <Button color="primary" id="btnRowInsert" className="btn-pill" onClick={this.toggleModalInsert}>&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-clone"></i>&nbsp;<span>Insert&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null}
          
          
          <Button color="light" id="btnFilter"  className="btn-pill" onClick={this.tableFilter}>&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-filter"></i>&nbsp;<span>Filter&nbsp;&nbsp;&nbsp;&nbsp;</span></Button>
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
          <HotTable ref={this.hotTableComponent} id="hot2" settings={this.hotSettings} licenseKey="non-commercial-and-evaluation" />
        </div>
    )
  }
}

export default UserView;
