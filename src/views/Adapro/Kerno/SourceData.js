import React, { Component } from 'react';
import SortableTree, {changeNodeAtPath, } from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import { Button, Row, Col, Modal, ModalBody, Card, CardHeader, CardBody, CardFooter, Form, FormGroup, Label, Input, FormFeedback, Tooltip } from 'reactstrap'
import FileExplorerTheme from 'react-sortable-tree-theme-full-node-drag';
import MultiSelect from "@kenshooui/react-multi-select";
import SidePanel from './SidePanel'
import API from 'api';

export default class Tree extends Component {
  constructor(props) {
    super(props);

    this.id = 3
    this.state = {
        selId:null,
        selPanel:null,
        source_Modal: false,
        table_Modal: false,
        preview_Modal: false,
        sourcename_Input: '',
        table_Items: [
          { id: "0110001", label: "Customer_CoreBank" },
          { id: "0110002", label: "Customer_CreditCard", disabled: false },
          { id: "0110003", label: "Deposits", disabled: false },
          { id: "0110004", label: "Savings" },
          { id: "0110005", label: "CurrentAccounts" },
          { id: "0110006", label: "Loans" }
        ],
        tableCat_Items: [],
        selTableItems: [],
        //treeData: [{ title: 'Source 1', children: [{ title: 'Source 2' }] }],
        sourceTree_Data: [
          { title: 'Source 1', id: 1, type: 'source', className:'fa fa-th-large', isfilter: false, filter: {}, isfields: false, fields: {}, issortfields: false, sortfields:{}},
        ],
        getNodeKey: ({ treeIndex }) =>  treeIndex,
        generateNodeProps: ((rowInfo) => ({
            listIndex: 0,
            lowerSiblingCounts: [],
            title: (<span><i className={rowInfo.node.className} aria-hidden="true"></i>&nbsp;{rowInfo.node.title}</span>),
            style: {
              color: rowInfo.node.id==this.state.selId?'#63c2de':''
            },
            buttons: 
            rowInfo.parentNode!=null?
              rowInfo.path[1]-rowInfo.path[0]!=1?
                //Table with join key
                [
                  // <Button color="secondary" size="sm" className="btn-pill" onClick={() => {
                  //   this.setState({selId:rowInfo.node.id, selPanel:'10'})
                  // }}><i className="fa fa-pencil"></i></Button>,
                  
                  rowInfo.node.iskeys?
                  <div>
                    <Button id={'btnKey'+rowInfo.node.id} color="info" size="sm" className="btn-pill" onClick={() => {
                      this.setState({selId:rowInfo.node.id, selPanel:'99'},()=>{
                        this.setState({selId:rowInfo.node.id, selPanel:'13'})
                      })
                    }}><i className="fa fa-key"></i></Button>
                    <Tooltip placement="top" isOpen={this.state['btnKey'+rowInfo.node.id]} target={'btnKey'+rowInfo.node.id} toggle={() => { this.setState({ ['btnKey'+rowInfo.node.id]:!this.state['btnKey'+rowInfo.node.id] }) }} >Join Key</Tooltip>                    
                  </div>
                  :
                  <div>
                    <Button id={'btnKey'+rowInfo.node.id} color="warning" size="sm" className="btn-pill" onClick={() => {
                      this.setState({selId:rowInfo.node.id, selPanel:'99'},()=>{
                        this.setState({selId:rowInfo.node.id, selPanel:'13'})
                      })
                    }}><i className="fa fa-key"></i></Button>
                    <Tooltip placement="top" isOpen={this.state['btnKey'+rowInfo.node.id]} target={'btnKey'+rowInfo.node.id} toggle={() => { this.setState({ ['btnKey'+rowInfo.node.id]:!this.state['btnKey'+rowInfo.node.id] }) }} >Join Key</Tooltip>
                  </div>,
                  <div>
                    <Button id={'btnDeleteTable'+rowInfo.node.id} outline color="danger" size="sm" className="btn-pill" onClick={() => {
                      this.removeNode(rowInfo.node.id)
                      if(rowInfo.parentNode.children.length==0||rowInfo.node.id==this.state.selId)
                      this.setState({selId:rowInfo.node.id, selPanel:'99'},() => { })
                    }}><i className="fa fa-trash"></i></Button>
                    <Tooltip placement="top" isOpen={this.state['btnDeleteTable'+rowInfo.node.id]} target={'btnDeleteTable'+rowInfo.node.id} toggle={() => { this.setState({ ['btnDeleteTable'+rowInfo.node.id]:!this.state['btnDeleteTable'+rowInfo.node.id] }) }} >Delete Table</Tooltip>
                  </div>
                ]
                :
                //Table without join key
                [
                  // <Button color="secondary" size="sm" className="btn-pill" onClick={() => {
                  //   this.setState({selId:rowInfo.node.id, selPanel:'10'})
                  // }}><i className="fa fa-pencil"></i></Button>,
                  <div>
                    <Button id={'btnDeleteTable'+rowInfo.node.id} outline color="danger" size="sm" className="btn-pill" onClick={() => {
                      this.removeNode(rowInfo.node.id)
                      if(rowInfo.parentNode.children.length==0||rowInfo.node.id==this.state.selId||(rowInfo.parentNode.children.length==1&&this.state.selPanel=='13'))
                      this.setState({selId:rowInfo.node.id, selPanel:'99'},() => { })
                    }}><i className="fa fa-trash"></i></Button>
                    <Tooltip placement="top" isOpen={this.state['btnDeleteTable'+rowInfo.node.id]} target={'btnDeleteTable'+rowInfo.node.id} toggle={() => { this.setState({ ['btnDeleteTable'+rowInfo.node.id]:!this.state['btnDeleteTable'+rowInfo.node.id] }) }} >Delete Table</Tooltip>
                  </div>
                ]
            :
              rowInfo.node.children==undefined?
                //Source without table
                [
                  <div>
                    <Button id={'btnEditSource'+rowInfo.node.id} outline color="secondary" size="sm" className="btn-pill" onClick={() => {
                      this.setState({selId:rowInfo.node.id, selPanel:'00'})
                    }}><i className="fa fa-pencil"></i></Button>
                    <Tooltip placement="top" isOpen={this.state['btnEditSource'+rowInfo.node.id]} target={'btnEditSource'+rowInfo.node.id} toggle={() => { this.setState({ ['btnEditSource'+rowInfo.node.id]:!this.state['btnEditSource'+rowInfo.node.id] }) }} >Edit Source Name</Tooltip>
                  </div>,
                  
                  <div>
                    <Button id={'btnTable'+rowInfo.node.id} color="warning" size="sm" className="btn-pill" onClick={() => {
                      this.tableAddFromSource(rowInfo.node.id)
                    }}><i className="fa fa-table"></i></Button>
                    <Tooltip placement="top" isOpen={this.state['btnTable'+rowInfo.node.id]} target={'btnTable'+rowInfo.node.id} toggle={() => { this.setState({ ['btnTable'+rowInfo.node.id]:!this.state['btnTable'+rowInfo.node.id] }) }} >Add New Table</Tooltip>
                  </div>,

                  <div>
                    <Button id={'btnDeleteSource'+rowInfo.node.id} outline color="danger" size="sm" className="btn-pill" onClick={() => {
                      this.removeNode(rowInfo.node.id)
                    }}><i className="fa fa-trash"></i></Button>
                    <Tooltip placement="top" isOpen={this.state['btnDeleteSource'+rowInfo.node.id]} target={'btnDeleteSource'+rowInfo.node.id} toggle={() => { this.setState({ ['btnDeleteSource'+rowInfo.node.id]:!this.state['btnDeleteSource'+rowInfo.node.id] }) }} >Delete Source</Tooltip>
                  </div>
                ]
              :
                rowInfo.node.children.length>0?
                  //Source with table 
                  [
                    <div>
                      <Button id={'btnEditSource'+rowInfo.node.id} outline color="secondary" size="sm" className="btn-pill" onClick={() => {
                        this.setState({selId:rowInfo.node.id, selPanel:'00'})
                      }}><i className="fa fa-pencil"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnEditSource'+rowInfo.node.id]} target={'btnEditSource'+rowInfo.node.id} toggle={() => { this.setState({ ['btnEditSource'+rowInfo.node.id]:!this.state['btnEditSource'+rowInfo.node.id] }) }} >Edit Source Name</Tooltip>
                    </div>,

                    <div>
                      <Button id={'btnTable'+rowInfo.node.id} outline color="secondary" size="sm" className="btn-pill" onClick={() => {
                        this.tableAddFromSource(rowInfo.node.id)
                      }}><i className="fa fa-table"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnTable'+rowInfo.node.id]} target={'btnTable'+rowInfo.node.id} toggle={() => { this.setState({ ['btnTable'+rowInfo.node.id]:!this.state['btnTable'+rowInfo.node.id] }) }} >Add New Table</Tooltip>
                    </div>,

                    rowInfo.node.isfilter?
                    <div>
                      <Button id={'btnFilter'+rowInfo.node.id} color="info" size="sm" className="btn-pill" onClick={() => {
                        this.setState({selId:rowInfo.node.id, selPanel:'99'},()=>{
                          this.setState({selId:rowInfo.node.id, selPanel:'01'})
                        })
                      }}><i className="fa fa-filter"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnFilter'+rowInfo.node.id]} target={'btnFilter'+rowInfo.node.id} toggle={() => { this.setState({ ['btnFilter'+rowInfo.node.id]:!this.state['btnFilter'+rowInfo.node.id] }) }} >Source Filter</Tooltip>
                    </div>
                    :
                    <div>
                      <Button id={'btnFilter'+rowInfo.node.id} outline color="primary" size="sm" className="btn-pill" onClick={() => {
                        this.setState({selId:rowInfo.node.id, selPanel:'99'},()=>{
                          this.setState({selId:rowInfo.node.id, selPanel:'01'})
                        })
                      }}><i className="fa fa-filter"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnFilter'+rowInfo.node.id]} target={'btnFilter'+rowInfo.node.id} toggle={() => { this.setState({ ['btnFilter'+rowInfo.node.id]:!this.state['btnFilter'+rowInfo.node.id] }) }} >Source Filter</Tooltip>
                    </div>,
                    // <Button color="primary" size="sm" className="btn-pill" onClick={() => {
                    //   this.setState({selId:rowInfo.node.id, selPanel:'02'})
                    // }}><i className="fa fa-list-ul"></i></Button>,
                    
                    rowInfo.node.isfields?
                    <div>
                      <Button id={'btnField'+rowInfo.node.id} color="info" size="sm" className="btn-pill" onClick={() => {
                        this.setState({selId:rowInfo.node.id, selPanel:'99'},()=>{
                          this.setState({selId:rowInfo.node.id, selPanel:'03'})
                        })
                      }}><i className="fa fa-tasks"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnField'+rowInfo.node.id]} target={'btnField'+rowInfo.node.id} toggle={() => { this.setState({ ['btnField'+rowInfo.node.id]:!this.state['btnField'+rowInfo.node.id] }) }} >Field Selection & Transformation</Tooltip>
                    </div>
                    :
                    <div>
                      <Button id={'btnField'+rowInfo.node.id} color="warning" size="sm" className="btn-pill" onClick={() => {
                        this.setState({selId:rowInfo.node.id, selPanel:'99'},()=>{
                          this.setState({selId:rowInfo.node.id, selPanel:'03'})
                        })
                      }}><i className="fa fa-tasks"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnField'+rowInfo.node.id]} target={'btnField'+rowInfo.node.id} toggle={() => { this.setState({ ['btnField'+rowInfo.node.id]:!this.state['btnField'+rowInfo.node.id] }) }} >Field Selection & Transformation</Tooltip>
                    </div>,
                    
                    rowInfo.node.issortfields?
                    <div>
                      <Button id={'btnSort'+rowInfo.node.id} color="info" size="sm" className="btn-pill" onClick={() => {
                        this.setState({selId:rowInfo.node.id, selPanel:'04'})
                      }}><i className="fa fa-sort-amount-asc"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnSort'+rowInfo.node.id]} target={'btnSort'+rowInfo.node.id} toggle={() => { this.setState({ ['btnSort'+rowInfo.node.id]:!this.state['btnSort'+rowInfo.node.id] }) }} >Sort Order</Tooltip>
                    </div>
                    :
                    <div>
                      <Button id={'btnSort'+rowInfo.node.id} outline color="primary" size="sm" className="btn-pill" onClick={() => {
                        this.setState({selId:rowInfo.node.id, selPanel:'04'})
                      }}><i className="fa fa-sort-amount-asc"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnSort'+rowInfo.node.id]} target={'btnSort'+rowInfo.node.id} toggle={() => { this.setState({ ['btnSort'+rowInfo.node.id]:!this.state['btnSort'+rowInfo.node.id] }) }} >Sort Order</Tooltip>
                    </div>,

                    <div>
                      <Button id={'btnDeleteSource'+rowInfo.node.id} outline color="danger" size="sm" className="btn-pill" onClick={() => {
                        //this.setState({selId:rowInfo.node.id, selPanel:'99'},() => { })
                        this.removeNode(rowInfo.node.id)
                      }}><i className="fa fa-trash"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnDeleteSource'+rowInfo.node.id]} target={'btnDeleteSource'+rowInfo.node.id} toggle={() => { this.setState({ ['btnDeleteSource'+rowInfo.node.id]:!this.state['btnDeleteSource'+rowInfo.node.id] }) }} >Delete Source</Tooltip>
                    </div>
                  ]
                :
                  //Source without table (after delete all table)
                  [
                    <div>
                      <Button id={'btnEditSource'+rowInfo.node.id} outline color="secondary" size="sm" className="btn-pill" onClick={() => {
                        this.setState({selId:rowInfo.node.id, selPanel:'00'})
                      }}><i className="fa fa-pencil"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnEditSource'+rowInfo.node.id]} target={'btnEditSource'+rowInfo.node.id} toggle={() => { this.setState({ ['btnEditSource'+rowInfo.node.id]:!this.state['btnEditSource'+rowInfo.node.id] }) }} >Edit Source Name</Tooltip>
                    </div>,
                    
                    <div>
                      <Button id={'btnTable'+rowInfo.node.id} color="warning" size="sm" className="btn-pill" onClick={() => {
                        this.tableAddFromSource(rowInfo.node.id)
                      }}><i className="fa fa-table"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnTable'+rowInfo.node.id]} target={'btnTable'+rowInfo.node.id} toggle={() => { this.setState({ ['btnTable'+rowInfo.node.id]:!this.state['btnTable'+rowInfo.node.id] }) }} >Add New Table</Tooltip>
                    </div>,

                    <div>
                      <Button id={'btnDeleteSource'+rowInfo.node.id} outline color="danger" size="sm" className="btn-pill" onClick={() => {
                        this.removeNode(rowInfo.node.id)
                      }}><i className="fa fa-trash"></i></Button>
                      <Tooltip placement="top" isOpen={this.state['btnDeleteSource'+rowInfo.node.id]} target={'btnDeleteSource'+rowInfo.node.id} toggle={() => { this.setState({ ['btnDeleteSource'+rowInfo.node.id]:!this.state['btnDeleteSource'+rowInfo.node.id] }) }} >Delete Source</Tooltip>
                    </div>
                  ]
        })),
        canDrag: true,
        tableOptions: []
    };
  }
  optionTableGet = () => {
    API.post("/api/dtr/options/table/get").then(data => {
      this.setState({ table_Items: data.data.table_Items, tableCat_Items: data.data.tableCat_Items },()=>{ })
    })
  }
  optionSourceFieldGet = (tableParam,parentId) => {
    //if selId is children, update to parent id
    // let _tempId = 0
    // for(let i=0;i<this.state.sourceTree_Data.length;i++) {
    //   if(this.state.sourceTree_Data[i].id==this.state.selId) { // parent 
    //     _tempId = this.state.sourceTree_Data[i].id
    //   } else { //children
    //     for(let j=0;j<this.state.sourceTree_Data[i].children.length;j++) {
    //       if(this.state.sourceTree_Data[i].children[j].id==this.state.selId) {
    //         //set id to i
    //         _tempId = this.state.sourceTree_Data[i].id
    //       }
    //     }
    //   }
    // }

    if(tableParam.length>0) {
      API.post("/api/dtr/options/sourcefield/get", null, {params: { tables: tableParam, }})
      .then(data => {
        this.setState({ ['sourceField_Items'+parentId]: data.data.sourceField_Items },()=>{ })
      })
    } else {
      this.setState({ ['sourceField_Items'+parentId]: [] })
    }
  }
  optionFilterFieldGet = (tableParam,parentId) => {
    //if selId is children, update to parent id
    // let _tempId = 0
    // for(let i=0;i<this.state.sourceTree_Data.length;i++) {
    //   console.log(this.state.sourceTree_Data[i].id+' - '+this.state.selId)
    //   if(this.state.sourceTree_Data[i].id==this.state.selId) { // parent 
    //     _tempId = this.state.sourceTree_Data[i].id
    //   } else { //children
    //     for(let j=0;j<this.state.sourceTree_Data[i].children.length;j++) {
    //       console.log(this.state.sourceTree_Data[i].children[j].id+' - '+this.state.selId)
    //       if(this.state.sourceTree_Data[i].children[j].id==this.state.selId) {
    //         //set id to i
    //         _tempId = this.state.sourceTree_Data[i].id
    //       }
    //     }
    //   }
    // }
    // console.log("check ID : ")
    // console.log(_tempId)

    if(tableParam.length>0) {
      API.post("/api/dtr/options/filterfield/get", null, {params: { tables: tableParam, }})
      .then(data => {
        this.setState({ ['filterField_Items'+parentId]: data.data },()=>{ })
        // console.log(data.data)
      })
    } else {
      this.setState({ ['filterField_Items'+parentId]: {fields:{}} })
    }
  }
  optionKeyFieldGet = (tableParam,parentId) => {
    // console.log("FILTER FIELD GET")
    if(tableParam.length>0) {
      API.post("/api/dtr/options/keyfield/get", null, {params: { tables: tableParam, }})
      .then(data => {
        for(let i=0;i<this.state.sourceTree_Data.length;i++) {
          if(this.state.sourceTree_Data[i].id==parentId) {
            if(this.state.sourceTree_Data[i].children!=undefined) {
              for(let j=0;j<this.state.sourceTree_Data[i].children.length;j++) {
                console.log("CHECK STATE VALUE 4 KEY ITEMS  ")
                console.log(this.state.sourceTree_Data[i].children[j].id)
                this.setState({ ['keyField_Items'+this.state.sourceTree_Data[i].children[j].id]: data.data },()=>{ })
              }
            }
          }
        }
        // console.log(data.data)
      })
    } else {
      this.setState({ ['keyField_Items'+parentId]: {} })
    }
  }
  componentWillMount() {
    // console.log("Here ComponentDidMount SourceData")
    //connect to DB, populate items for Table Multiselect data
    this.optionTableGet()
  }
  handleMultiSelectChange = (selTableItems) => {
    this.setState({ selTableItems });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => { 
      
    })
  }
  handleSelectTableCatChange = (e) => {
    this.setState({ selTableCat: e.target.value }, () => {
      // console.log(this.state.selTableCat)
      API.post("/api/dtr/options/table/get", null, {params: { tablecat: this.state.selTableCat }})
      .then(data => {
        this.setState({ table_Items: data.data.table_Items, tableCat_Items: data.data.tableCat_Items }, ()=>{ })
      })
    })
    //query to db to refresh

  }
  updateParentState = (x,y) => {
    this.setState({ [x]: y },()=>{ console.log(x);console.log(this.state[x]) })
    console.log(x)
    console.log(y)
  }
  modifyButton = (node) => {
      // console.log(node)
  }
  changeChecking = (sourceTree_Data) => {
    let check=true
    for(let i=0;i<sourceTree_Data.length;i++) {
      if(sourceTree_Data[i].type=='table') check=false
      if(sourceTree_Data[i].children!=undefined) {
        for(let j=0;j<sourceTree_Data[i].children.length;j++) {
          if(sourceTree_Data[i].children[j].type=='source') {
            check=false
            // console.log("FALSE CHECKING")
          }
        }
      }
    }
    if(check) {
      this.setState({ sourceTree_Data })
    }
  }
  removeNode = (id) => {
    let _nodes = Object.assign([], this.state.sourceTree_Data)
    for(let i=0;i<_nodes.length;i++) {
      if(_nodes[i].children!=undefined) {
        for(let j=0;j<_nodes[i].children.length;j++) {
          if(_nodes[i].children[j].id==id) {
            
            //initialize filter builder data (field filter)
            this.optionFilterFieldGet(_nodes[i].children,_nodes[i].id)

            //initialize field multiselect data
            this.optionSourceFieldGet(_nodes[i].children,_nodes[i].id)

            //initialize key builder data
            this.optionKeyFieldGet(_nodes[i].children,_nodes[i].id)

            //check selected field, remove if fields are from deleted table
            //also apply the implication into selected sort field
            let _tempFieldData = Object.assign([], this.state['field_Data'+_nodes[i].id])
            let _tempSortData = Object.assign([], this.state['sort_Data'+_nodes[i].id])
            console.log("check temp sort data:")
            console.log(_tempSortData)
            for(let k=0;k<_tempFieldData.length;k++) {
              if(_tempFieldData[k].group==_nodes[i].children[j].title) {
                //splice it
                _tempFieldData.splice(k,1)
                k-=1
              }
            }
            for(let k=0;k<_tempSortData.length;k++) {
              if(_tempSortData[k].group==_nodes[i].children[j].title) {
                //splice it
                _tempSortData.splice(k,1)
                k-=1
              }
            }
            //update the state
            this.setState({
              ['field_Data'+_nodes[i].id]: _tempFieldData,
              ['sort_Data'+_nodes[i].id]: _tempSortData
            })

            //finally remove the node tree
            _nodes[i].children.splice(j,1)


          }
        }
      }
      if(_nodes[i].id==id) {
        _nodes.splice(i,1)
        // console.log("DELETED")
      }
    }
    this.setState({ 
      sourceTree_Data: _nodes 
    }, () => {

    })
  }
  updateNode = (id,newname) => {
    let _nodes = Object.assign([], this.state.sourceTree_Data)
    for(let i=0;i<_nodes.length;i++) {
      if(_nodes[i].id==id) {
        _nodes[i].title = newname
      }
    }
    this.setState({ 
      sourceTree_Data: _nodes 
    }, () => {

    })
  }
  tableAdd = () => {
    this.setState({
      table_Modal: !this.state.table_Modal
    },() => {
      this.setState({
        selTableItems: []
      })
    })
  }
  tableAddFromSource = (x) => {    
    this.setState({
      table_Modal: !this.state.table_Modal,
      selId: x
    },() => {
      this.setState({
        selTableItems: []
      })
    })
  }
  tableAddCancel = () => {
    this.setState({
      table_Modal: !this.state.table_Modal
    },() => {
      
    })
  }
  tableAddSave = () => {
    let _nodes = Object.assign([], this.state.sourceTree_Data)
    let _newnode 
    let _index = 0

    let _tempNumber = ''
    let _tempName = ''
    let _isDuplicate = false
    let _duplicateNumber = 1

    //find node index by Id
    for(let i=0;i<this.state.sourceTree_Data.length;i++) {
      if(this.state.sourceTree_Data[i].id==this.state.selId) _index = i
      // console.log(_index)
    }

    for(let i=0;i<this.state.selTableItems.length;i++) {
      //check duplicate table name, and add new alias
      _tempName = ''
      _duplicateNumber = 1
      //if fieldname is same, create auto field alias (unique)
      for(let j=0;j<_nodes.length;j++) {
          if(_nodes[j].id==this.state.selId) {
            if(_nodes[j].children!=undefined) {
              for(let k=0;k<_nodes[j].children.length;k++) {
                if(_nodes[j].children[k].title==this.state.selTableItems[i].label) {
                  _isDuplicate = true
                  if(
                    this.state.selTableItems[i].label==_nodes[j].children[k].title.substr(0,this.state.selTableItems[i].label.length)
                    &&_nodes[j].children[k].title.substr(this.state.selTableItems[i].label.length,1)=='_'
                    // &&_nodes[j].children[k].title.substr(_nodes[j].children[k].title.length-1,1)==')'
                  ) {
                    //get the index
                    _tempNumber = _nodes[j].children[k].title.substr(this.state.selTableItems[i].label.length+1)
                    //_tempNumber = _tempNumber.substr(0,_tempNumber.length-1)
                    if(parseInt(_tempNumber)>_duplicateNumber) _duplicateNumber = parseInt(_tempNumber)
                  }
                  _duplicateNumber++
                  _tempName = this.state.selTableItems[i].label+'_'+_duplicateNumber  
                }
              }
            }
          }
      }

      if(_isDuplicate) {          
          _isDuplicate=false
      } else {
        _tempName = this.state.selTableItems[i].label
      }

      _newnode = {
        title: _tempName,//this.state.selTableItems[i].label,
        table: this.state.selTableItems[i].label,
        id: this.id++,
        code:this.state.selTableItems[i].id,
        type:'table',
        className:'fa fa-table', 
        iskeys:false, 
        keys:{}
      }
      if(_nodes[_index].children==undefined||_nodes[_index].children==null) _nodes[_index].children = []
      _nodes[_index].expanded = true
      _nodes[_index].children.push(_newnode)
    }

    this.setState({
      sourceTree_Data: _nodes,
      table_Modal: !this.state.table_Modal
    }, () => {
      // if selId is children, update to parent id
      let _tempId = 0
      let _tempParentId = 0
      for(let i=0;i<this.state.sourceTree_Data.length;i++) {
        if(this.state.sourceTree_Data[i].id==this.state.selId) { // parent 
          //_tempId = this.state.sourceTree_Data[i].id
          _tempParentId = this.state.sourceTree_Data[i].id
        } else { //children
          for(let j=0;j<this.state.sourceTree_Data[i].children.length;j++) {
            if(this.state.sourceTree_Data[i].children[j].id==this.state.selId) {
              //set id to i
              _tempId = this.state.sourceTree_Data[i].children[j].id
              _tempParentId = this.state.sourceTree_Data[i].id
            }
          }
        }
      }

      this.optionFilterFieldGet(_nodes[_index].children,_tempParentId)
      this.optionSourceFieldGet(_nodes[_index].children,_tempParentId)
      this.optionKeyFieldGet(_nodes[_index].children,_tempParentId)
    })
  }
  sourceAdd = () => {
    this.setState({
        source_Modal: !this.state.source_Modal
    }, ()=> {

    })
  }
  sourceAddCancel = () => {
    this.setState({
      source_Modal: !this.state.source_Modal
    }, () => {
      this.setState({
        sourcename_Input: ''
      })
    })
  }
  sourceAddSave = () => {
    let _nodes = Object.assign([], this.state.sourceTree_Data) 
    let _newnode = {title: this.state.sourcename_Input,id: this.id++,type:'source', className:'fa fa-th-large', isfilter: false, filter: {}, isfields:false, fields: {}, issortfields:false, sortfields:{}}
    _nodes.push(_newnode)
    this.setState({
      sourceTree_Data: _nodes,
      source_Modal: !this.state.source_Modal
    }, ()=> {
      this.setState({
        sourcename_Input: ''
      })
    })
  }
  previewSources = () => {
    console.log("PREVIEW SOURCES")

    //loop sesuai jumlah sources
    let _sql = ''
    for(let i=0;i<this.state.sourceTree_Data.length;i++) {
      //console.log(this.state.sourceTree_Data[i].label)
      // console.log("SELECT")
      //loop field_DataX
      let _field = ''
      if(this.state['field_Data'+this.state.sourceTree_Data[i].id]!=undefined) {
        for(let j=0;j<this.state['field_Data'+this.state.sourceTree_Data[i].id].length;j++) {
          if(j>0) _field+=', '
          _field += this.state['field_Data'+this.state.sourceTree_Data[i].id][j].field+' \''+this.state['field_Data'+this.state.sourceTree_Data[i].id][j].label+'\''
        }
      }
      // console.log(_field)

      // console.log("FROM")
      //loop children table
      let _table = ''
      if(this.state.sourceTree_Data[i].children!=undefined) {
        for(let j=0;j<this.state.sourceTree_Data[i].children.length;j++) {
          if(j>0) { //left join
            _table += ' left join '
          }
          _table += this.state.sourceTree_Data[i].children[j].table + ' ' + this.state.sourceTree_Data[i].children[j].title
          if(j>0) { //join key
            _table += ' on '
            //get join key
            if(this.state['keySql_Data'+this.state.sourceTree_Data[i].children[j].id]!=undefined)
            _table += this.state['keySql_Data'+this.state.sourceTree_Data[i].children[j].id]
          }
        }
      }
      // console.log(_table)

      // console.log("WHERE")
      //get filter condition
      let _filter = ''
      if(this.state['filterSql_Data'+this.state.sourceTree_Data[i].id]!=undefined)
      _filter = this.state['filterSql_Data'+this.state.sourceTree_Data[i].id]
      // console.log(_filter)
      
      // console.log("ORDER BY")
      //loop sort_DataX
      let _sort = ''
      if(this.state['sort_Data'+this.state.sourceTree_Data[i].id]!=undefined) {
        for(let j=0;j<this.state['sort_Data'+this.state.sourceTree_Data[i].id].length;j++) {
          if(j>0) _sort+=', '
          _sort += this.state['sort_Data'+this.state.sourceTree_Data[i].id][j].field
        }
      }
      // console.log(_sort)


      let _sqlTemp = ''
      if(_field!='') _sqlTemp += 'SELECT ' + _field 
      if(_table!='') _sqlTemp += ' FROM ' + _table 
      if(_filter!='') _sqlTemp += ' WHERE ' + _filter 
      if(_sort!='') _sqlTemp += ' ORDER BY ' + _sort

      if(_sqlTemp!='') {
        if(i>0) _sql += ' UNION ALL '
        _sql += _sqlTemp
      }

    }
    console.log(_sql)
    this.setState({
      previewSql_Data : _sql,
      preview_Modal: true
    })
  }
  previewClose = () => {
    this.setState({
      preview_Modal: !this.state.preview_Modal
    })
  }
  render() {
    return (
      <div style={{ height: 400 }}>
        <div>
        <Button color="light" id="btnSourceAdd" className="btn-pill" onClick={this.sourceAdd}>&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add Source&nbsp;</span></Button>
        {/* <Button disabled={this.state.treeData.length>0?false:true} color="light" id="btnTableAdd" className="btn-pill" onClick={this.tableAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add Table&nbsp;&nbsp;</span></Button> */}
        <Button color="info" id="btnReset" className="btn-pill" onClick={this.previewSources}>&nbsp;&nbsp;<i className="fa fa-laptop"></i>&nbsp;<span>Preview&nbsp;&nbsp;</span></Button>
        <Button color="dark" id="btnReset" className="btn-pill" >&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-undo"></i>&nbsp;<span>Reset&nbsp;&nbsp;&nbsp;&nbsp;</span></Button>
        <Button color="success" id="btnSave" className="btn-pill" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-save"></i>&nbsp;<span>Save&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button>
        </div>
        <Row>&nbsp;</Row>
        <Row>
          <Col className="col-md-4">
            <SortableTree
              treeData={this.state.sourceTree_Data}
              // onChange={treeData => this.setState({ treeData })}
              onChange={sourceTree_Data => this.changeChecking(sourceTree_Data)}
              onMoveNode={(node) => this.modifyButton(node)}
              generateNodeProps={this.state.generateNodeProps}
              maxDepth={2}
              rowHeight={50}
              slideRegionSize={20}
              scaffoldBlockPxWidth={25}
              canDrag={this.state.canDrag}
              isVirtualized = {false}
              theme={FileExplorerTheme}
            />
            
          </Col>
          <Col className="col-md-8" id="sidePanel">
            <SidePanel 
              panel={this.state.selPanel}
              id={this.state.selId}
              updateParentState={this.updateParentState}
              updateNode={this.updateNode}

              treeData={this.state.sourceTree_Data}
              filterData={this.state['filter_Data'+this.state.selId]}
              fieldData={this.state['field_Data'+this.state.selId]}
              sortData={this.state['sort_Data'+this.state.selId]}
              keyData={this.state['key_Data'+this.state.selId]}

              sourceField_Items={this.state['sourceField_Items'+this.state.selId]}
              filterField_Items={this.state['filterField_Items'+this.state.selId]}
              sortField_Items={this.state['sortField_Items'+this.state.seldId]}
              keyField_Items={this.state['keyField_Items'+this.state.selId]}
            />
          </Col>
        </Row>

        <Modal isOpen={this.state.source_Modal} toggle={this.toggleModalSource} className={'modal-lg ' + this.props.className}>
          <ModalBody>
            <Card>
              <CardHeader>
                <strong>Add New Source</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col xs="12" md="12">
                      <Input type="text" id="sourcename" name="sourcename_Input" valid={this.state['sourcename_Input_Valid']} invalid={this.state['sourcename_Input_Invalid']} placeholder="Please input sourcename" value={this.state.sourcename_Input}  onChange={this.handleChange} />
                      <FormFeedback>{this.state['sourcename_Input_InvalidMsg']}</FormFeedback>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter align="right">
                <Button color="secondary" onClick={this.sourceAddCancel}><i className="fa fa-close"></i>&nbsp;Cancel</Button>&nbsp;
                <Button color="primary" onClick={this.sourceAddSave}>&nbsp;<i className="fa fa-arrow-right"></i>&nbsp;Next&nbsp;</Button>{' '}
              </CardFooter>
            </Card>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.table_Modal} toggle={this.toggleModalTable} className={'modal-lg ' + this.props.className}>
          <ModalBody>
            <Card>
              <CardHeader>
                <strong><i className="fa fa-table"></i>&nbsp;Add New Table</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="2"><Label>Category</Label></Col>
                    <Col xs="12" md="10">
                      <Input type="select" name="selecttablecat" id="selecttablecat" value={this.state.selTableCat} onChange={this.handleSelectTableCatChange}>
                        <option value="">ALL</option>
                        {this.state.tableCat_Items.map(option => (
                            <option key={option.tblcat_code} value={option.tblcat_code}>
                            {option.tblcat_name} - {option.tblcat_desc}
                            </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2"><Label>Table</Label></Col>
                    <Col xs="12" md="10">
                      <MultiSelect
                        items={this.state.table_Items}
                        selectedItems={this.state.selTableItems}
                        onChange={this.handleMultiSelectChange}
                        height={300}
                        responsiveHeight={"300px"}
                        itemHeight={30}
                      />
                      <FormFeedback>{this.state['sourcename_Input_InvalidMsg']}</FormFeedback>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter align="right">
                <Button color="secondary" onClick={this.tableAddCancel}><i className="fa fa-close"></i>&nbsp;Cancel</Button>&nbsp;
                <Button color="primary" onClick={this.tableAddSave}>&nbsp;<i className="fa fa-arrow-right"></i>&nbsp;Next&nbsp;</Button>{' '}
              </CardFooter>
            </Card>
          </ModalBody>
        </Modal>
        
        <Modal isOpen={this.state.preview_Modal} toggle={this.toggleModalPreview} className={'modal-lg ' + this.props.className}>
          <ModalBody>
            <Card>
                <CardHeader>
                  <strong><i className="fa fa-search"></i>&nbsp;SQL Script Preview</strong>
                </CardHeader>
                <CardBody>
                          {this.state.previewSql_Data}
                </CardBody>
                <CardFooter>
                  <Button color="secondary" onClick={this.previewClose}><i className="fa fa-close"></i>&nbsp;Close</Button>&nbsp;
                </CardFooter>
            </Card>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}