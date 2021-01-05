import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, Form, FormGroup, FormFeedback, Label, Input, Button, 
    ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText,
    TabContent, TabPane, Modal, ModalBody, Badge } from 'reactstrap';
import {render} from 'react-dom';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import MultiSelect from "@kenshooui/react-multi-select";

import SidePanelField from './SidePanelField'

// import QueryBuilder from 'react-querybuilder';
// const fields = [
//     { name: 'firstName', label: 'First Name' },
//     { name: 'lastName', label: 'Last Name' },
//     { name: 'age', label: 'Age' },
//     { name: 'address', label: 'Address' },
//     { name: 'phone', label: 'Phone' },
//     { name: 'email', label: 'Email' },
//     { name: 'twitter', label: 'Twitter' },
//     { name: 'isDev', label: 'Is a Developer?', value: false }
//   ];
// const operators = [
//     { name: "=", label: "=" },
//     { name: "!=", label: "!=" },
//     { name: "<", label: "<" },
//     { name: ">", label: ">" },
//     { name: "<=", label: "<=" },
//     { name: ">=", label: ">=" },
//     { name: "null", label: "Is Null" },
//     { name: "notNull", label: "Is Not Null" },
//     { name: "in", label: "In" },
//     { name: "notIn", label: "Not In" }
//   ];

//import {QueryBuilderComponent} from '@syncfusion/ej2-react-querybuilder';

import {Query, Builder, Preview, Utils} from 'react-awesome-query-builder';
import config from './config'; //see below 'Config format'
import configKey from './configKey'; //see below 'Config format'

import { fromJS } from 'immutable';
const {queryBuilderFormat, queryString, mongodbFormat} = Utils;
var stringify = require('json-stringify-safe');
const Immutable = require('immutable');
const transit = require('transit-immutable-js');

const SortableItem = SortableElement(
    ({value,updateStateFromChild,selectedItem,removeArrayItem,rowIndex}) => 
    <div style={value.id==selectedItem.id?{color:'#63c2de',fontWeight:'bold',width:350}:{width:350}}>
        <Badge color="light">{(rowIndex+1)<=9?'0'+(rowIndex+1):(rowIndex+1)}</Badge>
        
        <Button className="fa fa-close" outline size="sm" color="danger" onClick={() => {removeArrayItem(value.id)}}/>
        <Button className="fa fa-caret-square-o-right" outline size="sm" color="light" onClick={() => {updateStateFromChild('selectedArrayItems',value)}}/>&nbsp;

        {value.fieldtransformed==''? '' : <i className="fa fa-gears"></i>}&nbsp;
        {/* {value.field} */}
        {value.label==''?'':value.label}

    </div>
);
const SortableList = SortableContainer(({items,updateStateFromChild,selectedItem,removeArrayItem}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${value.id}`} index={index} value={value} rowIndex={index}
            updateStateFromChild={updateStateFromChild}
            selectedItem={selectedItem}
            removeArrayItem={removeArrayItem}
        />
      ))}
    </div>
  );
});
const SortableSortItem = SortableElement(
    ({value,updateStateFromChild,selectedItem,removeArrayItem,rowIndex}) => 
    <div>
        <Badge color="light">{(rowIndex+1)<=9?'0'+(rowIndex+1):(rowIndex+1)}</Badge>
        <Button className="fa fa-close" outline size="sm" color="danger" onClick={() => {removeArrayItem(value.id)}}/>
        {value.fieldtransformed==''? '' : <i className="fa fa-gears"></i>}&nbsp;
        {value.label==''?'':value.label}
    </div>
);
const SortableSortList = SortableContainer(({items,updateStateFromChild,selectedItem,removeArrayItem}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableSortItem key={`item-${value.id}`} index={index} value={value} rowIndex={index}
            updateStateFromChild={updateStateFromChild}
            selectedItem={selectedItem}
            removeArrayItem={removeArrayItem}
        />
      ))}
    </div>
  );
});
const {tree, ...config_props} = config;
const {treeKey, ...config_propsKey} = configKey;

var queryFields = {
    fields: {
        'customer': {
            label: 'Customer',
            type: '!struct',
            subfields: {
                customercode: {
                    label: 'Customer Code',
                    type: 'text',
                    // tableName: 't1',
                },
                customername: {
                    label: 'Customer Name',
                    type: 'text',
                },
                customerbirthdate: {
                    label: 'Customer Birth Date',
                    type: 'date',
                }
            }
        },
        deposit: {
            label: 'Deposit Accounts',
            type: '!struct',
            subfields: {
                accountnumber: {
                    label: 'Account Number',
                    type: 'text',
                    tableName: 't1',
                },
                customername: {
                    label: 'Account Name',
                    type: 'text',
                },
                customerbirthdate: {
                    label: 'Account Open Date',
                    type: 'date',
                },
                customerbirthplace: {
                    label: 'Account Balance',
                    type: 'text',
                },
            }
        },
        multicolor: {
            label: 'Colors',
            type: 'multiselect',
            listValues: {
                yellow: 'Yellow',
                green: 'Green',
                orange: 'Orange'
            },
        },
    }
}
var sortFields, sourceFields, filterFields, keyFields
var seriazlieAsImmutable = true;
var serializeTree, loadTree, initValue, initValueKey;
var defaultValue = '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["~#iOM",["9899b988-89ab-4cde-b012-316d61e16c19",["^0",["type","rule","id","9899b988-89ab-4cde-b012-316d61e16c19","properties",["^0",["field",null,"operator",null,"value",["~#iL",[]],"valueSrc",["^2",[]],"operatorOptions",null]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","9899b988-89ab-4cde-b012-316d61e16c19"]]]]]],"properties",["^0",["conjunction","AND","not",false]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]';
if (!seriazlieAsImmutable) {
    serializeTree = function(tree) {
        return JSON.stringify(tree.toJS());
    };
    loadTree = function(serTree) {
        let tree = JSON.parse(serTree);
        return fromJS(tree, function (key, value) {
          let outValue;
          if (key == 'value' && value.get(0) && value.get(0).toJS !== undefined)
            outValue = Immutable.List.of(value.get(0).toJS());
          else
            outValue = Immutable.Iterable.isIndexed(value) ? value.toList() : value.toOrderedMap();
          return outValue;
        });
    };
    initValue = '{"type":"group","id":"9a99988a-0123-4456-b89a-b1607f326fd8","children1":{"a98ab9b9-cdef-4012-b456-71607f326fd9":{"type":"rule","id":"a98ab9b9-cdef-4012-b456-71607f326fd9","properties":{"field":"multicolor","operator":"multiselect_equals","value":[["yellow","green"]],"valueSrc":["value"],"operatorOptions":null,"valueType":["multiselect"]},"path":["9a99988a-0123-4456-b89a-b1607f326fd8","a98ab9b9-cdef-4012-b456-71607f326fd9"]}},"properties":{"conjunction":"AND","not":false},"path":["9a99988a-0123-4456-b89a-b1607f326fd8"]}'
} else {
    serializeTree = transit.toJSON;
    loadTree = transit.fromJSON;
    initValue = '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["~#iOM",["a98ab9b9-cdef-4012-b456-71607f326fd9",["^0",["type","rule","id","a98ab9b9-cdef-4012-b456-71607f326fd9","properties",["^0",["field","multicolor","operator","multiselect_equals","value",["~#iL",[["yellow","green"]]],"valueSrc",["^2",["value"]],"operatorOptions",null,"valueType",["^2",["multiselect"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","a98ab9b9-cdef-4012-b456-71607f326fd9"]]]]]],"properties",["^0",["conjunction","AND","not",false]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]'
}

export default class SidePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [
                { id: "0110001", label: "Customer Code", group: "Customer", field:'Customer_Code', fieldtransformed:'' },
                { id: "0110002", label: "Customer Name", group: "Customer", field:'Customer_Name', fieldtransformed:'' },
                { id: "0110003", label: "Customer Birthdate", group: "Customer", field:'Customer_Birthdate', fieldtransformed:'' },
                { id: "0110004", label: "Customer Birthplace", group: "Customer", field:'Customer_Birthplace', fieldtransformed:'' },
                { id: "0111001", label: "Account Code", group: "Saving", field:'Account_Code', fieldtransformed:'' },
                { id: "0111002", label: "Account Name", group: "Saving", field:'Account_Name', fieldtransformed:'' },
                { id: "0111003", label: "Account Balance", group: "Saving", field:'Account_Balance', fieldtransformed:'' },
                { id: "0112002", label: "Account Code", group: "Loan", field:'Account_Code', fieldtransformed:'' }
            ],
            sortItems: [],
            selectedItems: [],
            arrayItems: [
            //     {id:1, label:'Item 1', field:'item1', fieldtransformed:''}, 
            //     {id:2, label:'Item 2', field:'item2', fieldtransformed:''}, 
            ],
            arraySortItems: [],
            selectedArrayItems: {},
            selectedArraySortItems: {},
            activeTab: null,
            modalField: false,
            modalSort: false,
            sourcename: 'initial',
            initValue: ''
        }
        this.selFieldId = this.state.arrayItems.length+1
        this.selSortFieldId = this.state.arraySortItems.length+1
        this.stateKeeper={
            sourcename:''
        }
    }
    removeArrayItem = (x) => {
        let _tempArrayItems = Object.assign([], this.state.arrayItems)
        let _tempSelectedArrayItems = {}
        for(let i=0;i<_tempArrayItems.length;i++) {
            if(_tempArrayItems[i].id==x) {
                _tempArrayItems.splice(i,1)
                if(this.state.selectedArrayItems.id!=x) _tempSelectedArrayItems = this.state.selectedArrayItems
                this.setState({
                    arrayItems: _tempArrayItems,
                    selectedArrayItems: _tempSelectedArrayItems
                },()=>{
                    this.props.updateParentState('field_Data'+this.props.id,this.state.arrayItems)

                    //get parent treedata to be modified : isfield@parent state
                    let _tempTreeData = Object.assign([],this.props.treeData)
                    for(let i=0;i<_tempTreeData.length;i++) { if(_tempTreeData[i].id==this.props.id) _tempTreeData[i].isfields=_tempArrayItems.length>0?true:false }
                    this.props.updateParentState('sourceTree_Data',_tempTreeData)
                })
            }
        }

    }
    removeArraySortItem = (x) => {
        let _tempArrayItems = Object.assign([], this.state.arraySortItems)
        let _tempSelectedArrayItems = {}
        for(let i=0;i<_tempArrayItems.length;i++) {
            if(_tempArrayItems[i].id==x) {
                _tempArrayItems.splice(i,1)
                if(this.state.selectedArrayItems.id!=x) _tempSelectedArrayItems = this.state.selectedArrayItems
                this.setState({
                    arraySortItems: _tempArrayItems,
                    selectedArraySortItems: _tempSelectedArrayItems
                },()=>{
                    this.props.updateParentState('sort_Data'+this.props.id,this.state.arraySortItems)

                    //get parent treedata to be modified : issortfields@parent state
                    let _tempTreeData = Object.assign([],this.props.treeData)
                    for(let i=0;i<_tempTreeData.length;i++) { if(_tempTreeData[i].id==this.props.id) _tempTreeData[i].issortfields=_tempArrayItems.length>0?true:false }
                    this.props.updateParentState('sourceTree_Data',_tempTreeData)
                })
            }
        }
    }
    updateStateFromChild = (x,y) => {
        this.setState({
            [x]: y
        },()=>{
            //console.log(this.state.selectedArrayItems)
            //console.log("updateStateFormChild")
            //console.log(this.state.selectedArrayItems)
        })
    }
    updateArrayItems = (id,rowData) => {
        let _items = Object.assign([], this.state.arrayItems)

        for(let i=0;i<_items.length;i++) {
            if(_items[i].id==id) {
                _items[i].label = rowData.label
                _items[i].fieldtransformed = rowData.fieldtransformed
            }
        }
        this.setState({
            arrayItems: _items 
        }, ()=>{
            this.props.updateParentState('field_Data'+this.props.id,this.state.arrayItems)
        })

    }

    updateSelectedItems = (x) => {
        this.setState({
            selectedArrayItems: x
        })
    }
    onSortEnd = ({oldIndex, newIndex}) => {
        //console.log(oldIndex)
        this.setState(({arrayItems}) => ({
            arrayItems: arrayMove(arrayItems, oldIndex, newIndex),
        }),()=>{
            this.props.updateParentState('field_Data'+this.props.id,this.state.arrayItems)
        });
    };
    onSortSortFieldEnd = ({oldIndex, newIndex}) => {
        //console.log(oldIndex)
        this.setState(({arraySortItems}) => ({
            arraySortItems: arrayMove(arraySortItems, oldIndex, newIndex),
        }),()=>{
            this.props.updateParentState('sort_Data'+this.props.id,this.state.arraySortItems)
        });
    };
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
            activeTab: tab
            });
        }
    }
    componentDidMount() {
        // console.log("Here ComponentDidMount SidePanel")
        
    }
    componentWillReceiveProps(nextProps){
        // console.log("COMPONENT WILL RECEIVE PROPS")
        console.log(nextProps)
        let _sourcename
        for(let i=0;i<nextProps.treeData.length;i++) {
            if(nextProps.treeData[i].id==nextProps.id) {
                _sourcename = nextProps.treeData[i].title
            }
        }

        // //TABLE CAT ITEMS
        // console.log(nextProps.options)
        // if(nextProps.options!=undefined) {
        //     this.setState({ tableCat_Items: nextProps.options },()=>{ console.log("tableCat_Items updated.") })
        // }

        //SOURCE FIELD ITEMS
        if(nextProps.sourceField_Items!=undefined) {
            //this.setState({ sourceField_Items:nextProps.sourceField_Items },()=>{ })
            sourceFields = nextProps.sourceField_Items 
        }
        else sourceFields = [] // this.setState({ sourceField_Items:[] },()=>{ })

        //FILTER FIELD ITEMS
        //console.log(nextProps.filterField_Items)
        if(nextProps.filterField_Items!=undefined) {
            //this.setState({ filterField_Items:nextProps.filterField_Items },()=>{ })
            filterFields = nextProps.filterField_Items
        }
        else filterFields = {fields: {}} //this.setState({ filterField_Items:[] },()=>{ })

        //SORT FIELD ITEMS
        if(nextProps.sortField_Items!=undefined) {
            // this.setState({ sortField_Items:nextProps.sortField_Items },()=>{ })
            sortFields = nextProps.sortField_Items
        }
        else sortFields = [] // this.setState({ sortField_Items:[] },()=>{ })

        //KEY FIELD ITEMS
        if(nextProps.keyField_Items!=undefined) {
            keyFields = nextProps.keyField_Items
        }
        else keyFields = {fields:{}} // this.setState({ sortField_Items:[] },()=>{ })


        //FILTER DATA
        if(nextProps.filterData!=undefined) initValue = nextProps.filterData
        else initValue = defaultValue

        //FIELD DATA
        let _tempFieldData
        if(nextProps.fieldData!=undefined) _tempFieldData = nextProps.fieldData
        else _tempFieldData = []

        //KEY DATA
        if(nextProps.keyData!=undefined) initValueKey = nextProps.keyData
        else initValueKey = defaultValue

        //SORT DATA
        let _tempSortData
        if(nextProps.sortData!=undefined) _tempSortData = nextProps.sortData
        else _tempSortData = []
        
        this.setState({
            filterField_Items: filterFields,
            keyField_Items: keyFields,
            sourceField_Items: sourceFields,
            sortField_Items: _tempFieldData,

            sourcename: _sourcename,
            initValue: initValue,
            initValueKey: initValueKey,
            arrayItems: _tempFieldData,
            arraySortItems: _tempSortData,

            // selectedArrayItems: {},
        },()=>{
            //console.log("STATE UPDATED from ComponentWillReceiveProps")
            console.log("CHECK KEY FIELD ITEM STATE")
            console.log(this.state.keyField_Items)
            console.log("CHECK FILTER FIELD ITEM STATE")
            console.log(this.state.filterField_Items)
        })
        
    }
    findDataById = (data,id,search) => {
        for(let i=0;i<data.length;i++) {
            if(data[i].id==id) return data[i][search]
            if(data[i].children!=undefined) {
                for(let j=0;j<data[i].children.length;j++) {
                    if(data[i].children[j].id==id) return data[i].children[j][search]
                }
            }
        }
        return null
    }
    findParentDataById = (data,id,search) => {
        for(let i=0;i<data.length;i++) {
            if(data[i].children!=undefined) {
                for(let j=0;j<data[i].children.length;j++) {
                    if(data[i].children[j].id==id) return data[i][search]
                }
            }
        }
        return null
    }
    getChildren = (props) => {
        // console.log("GETCHILDREN TRIGGERED")
        // console.log(props)
        const jsonStyle = { backgroundColor: 'darkgrey', margin: '10px', padding: '10px' } 
        // console.log(props.tree) //could not change

        return (
            <div style={{padding: '0px'}}>
                <div className="query-builder">
                    {/* {props.tree} */}
                    <Builder {...props} />
                </div>
                {/* <br /> */}
                {/* <div>
                  stringFormat: 
                  <pre style={jsonStyle}>
                    {stringify(queryString(props.tree, props.config), undefined, 2)}
                  </pre>
                </div>
                <hr/>
                <div>
                  humanStringFormat: 
                  <pre style={jsonStyle}>
                    {stringify(queryString(props.tree, props.config, true), undefined, 2)}
                  </pre>
                </div>
                <hr/>
                <div>
                  mongodbFormat: 
                    <pre style={jsonStyle}>
                      {stringify(mongodbFormat(props.tree, props.config), undefined, 2)}
                    </pre>
                </div>
                <hr/>
                <div>
                  queryBuilderFormat: 
                    <pre style={jsonStyle}>
                      {stringify(queryBuilderFormat(props.tree, props.config), undefined, 2)}
                    </pre>
                </div>
                <hr/>
                <div>
                  Tree: 
                  <pre style={jsonStyle}>
                    {stringify(props.tree, undefined, 2)}
                  </pre>
                </div>
                <hr/>
                <div>
                  Serialized Tree: 
                  <div style={jsonStyle}>
                    {serializeTree(props.tree)}
                  </div>
                </div> */}
            </div>
        )
    }
    handleMultiSelectChange = (selectedItems) => {
        this.setState({ selectedItems },()=>{
            // this.props.updateParentState('fieldData'+this.props.id,selectedItems)
        });
    }
    handleSortMultiSelectChange = (selectedSortItems) => {
        this.setState({ selectedSortItems },()=>{
            // this.props.updateParentState('fieldData'+this.props.id,selectedItems)
        });
    }
    handleFiltersChange = (tree) => {
        this.props.updateParentState('filter_Data'+this.props.id,serializeTree(tree))
        this.props.updateParentState('filterSql_Data'+this.props.id,queryString(tree,configKey))

        //update parent state isfilter@parent
        console.log("config:")
        console.log(config)
        console.log("queryString:")
        console.log(stringify(queryString(tree,config), undefined, 2))
        console.log(queryString(tree,config))
        let _tempTreeData = Object.assign([],this.props.treeData)
        for(let i=0;i<_tempTreeData.length;i++) {
            if(_tempTreeData[i].id==this.props.id) 
            _tempTreeData[i].isfilter = stringify(queryString(tree,config), undefined, 2)==undefined?false:true 
        }
        this.props.updateParentState('sourceTree_Data',_tempTreeData)        
    }
    handleKeysChange = (tree) => {
        this.props.updateParentState('key_Data'+this.props.id,serializeTree(tree))
        this.props.updateParentState('keySql_Data'+this.props.id,queryString(tree,configKey))

        //update parent state isfilter@parent
        let _tempTreeData = Object.assign([],this.props.treeData)
        for(let i=0;i<_tempTreeData.length;i++) {
            if(_tempTreeData[i].children!=undefined)
            for(let j=0;j<_tempTreeData[i].children.length;j++) {
                if(_tempTreeData[i].children[j].id==this.props.id) {
                    _tempTreeData[i].children[j].iskeys =  stringify(queryString(tree,configKey), undefined, 2)==undefined?false:true
                }
            }
        }
        this.props.updateParentState('sourceTree_Data',_tempTreeData)
    }
    handleSourceChange = (e) => {
        this.setState({
            sourcenamevalid:true,
            sourcenameinvalid:false,
            sourcenameinvalidmsg:'',
            [e.target.name]: e.target.value,
        },()=> {
            
        })

        let _inputInvalid, _inputInvalidMsg
        _inputInvalid=false
        if(e.target.value=='') {
            _inputInvalid=true
            _inputInvalidMsg='Failed to save! Source name could not be blank.'
        }

        if(_inputInvalid) {
            this.setState({
                sourcenamevalid: false,
                sourcenameinvalid: true,
                sourcenameinvalidmsg: _inputInvalidMsg
            },()=> {

            })
        }
        else {
            this.props.updateNode(this.props.id,e.target.value)            
        }
    }
    fieldAdd = () => {
        this.setState({
            modalField: !this.state.modalField
        },() => {
            this.setState({
            selectedItems: []
            })
        })
    }
    fieldAddCancel = () => {
        this.setState({
            modalField: !this.state.modalField
        },() => {
            
        })
    }
    fieldAddSave = () => {
        //copy from selectedData
        let _selectedItems = Object.assign([], this.state.selectedItems)
        let _arrayItems = Object.assign([], this.state.arrayItems)
        let _tempSelectedItem = {}
        let _isDuplicate = false
        let _duplicateNumber = 1
        let _tempNumber = ''
        // { id: "0112002", label: "Account Code", group: "Loan", field:'Account_Code', fieldtransformed:'' }
        // console.log(" ITEMS BEFORE")
        // console.log(this.state.items)
        for(let i=0;i<_selectedItems.length;i++) {
            //copy to new var to prevent overwrite previous data
            _tempSelectedItem = {}
            _duplicateNumber = 1
            //if fieldname is same, create auto field alias (unique)
            for(let j=0;j<_arrayItems.length;j++) {
                if(_selectedItems[i].label==_arrayItems[j].label) _isDuplicate = true
            }
            // if(_isDuplicate) {
            //     _selectedItems[i].label = _selectedItems[i].label+'_'                
            // }
            //rename id
            _tempSelectedItem.id = this.selFieldId++//_arrayItems.length+1
            _tempSelectedItem.fieldid = _selectedItems[i].id

            if(_isDuplicate) {
                for(let j=0;j<_arrayItems.length;j++) {
                    // console.log(_arrayItems[j].label.substr(0,_selectedItems[i].label.length))
                    // console.log(_arrayItems[j].label.substr(_selectedItems[i].label.length,2))
                    // console.log(_arrayItems[j].label.substr(_arrayItems[j].label.length-1,1))
                    if(
                        _selectedItems[i].label==_arrayItems[j].label.substr(0,_selectedItems[i].label.length)
                        &&_arrayItems[j].label.substr(_selectedItems[i].label.length,2)=='_('
                        &&_arrayItems[j].label.substr(_arrayItems[j].label.length-1,1)==')'
                    ) {
                        //get the index
                        _tempNumber = _arrayItems[j].label.substr(_selectedItems[i].label.length+2)
                        _tempNumber = _tempNumber.substr(0,_tempNumber.length-1)
                        // console.log("TEMP NUMBER :: "+_tempNumber)
                        if(parseInt(_tempNumber)>_duplicateNumber) _duplicateNumber = parseInt(_tempNumber)
                    }
                }
                _duplicateNumber++
                _tempSelectedItem.label = _selectedItems[i].label+'_('+_duplicateNumber+')'
                _isDuplicate=false
            } else {
                _tempSelectedItem.label = _selectedItems[i].label//+(_isDuplicate?'_':'')
            }
            _tempSelectedItem.group = _selectedItems[i].group
            _tempSelectedItem.field = _selectedItems[i].group+'.'+_selectedItems[i].field
            _tempSelectedItem.fieldtransformed = _selectedItems[i].fieldtransformed
            
            //push into list data
            _arrayItems.push(_tempSelectedItem)
        }
        // console.log("ITEMS AFTER")
        // console.log(this.state.items)

        

        //clear selectedData state & update arrayItems state
        this.setState({
            selectedItems:[],
            arrayItems:_arrayItems,
            modalField: !this.state.modalField,
        },()=>{
            this.props.updateParentState('field_Data'+this.props.id,_arrayItems)

            //get parent treedata to be modified : isfield@parent state
            let _tempTreeData = Object.assign([],this.props.treeData)
            for(let i=0;i<_tempTreeData.length;i++) { if(_tempTreeData[i].id==this.props.id) _tempTreeData[i].isfields = true }
            this.props.updateParentState('sourceTree_Data',_tempTreeData)

            //initiate sort fields multiselect data
            // this.props.updateParentState('sortField_Items'+this.props.id,_arrayItems)
            // sortFields = _arrayItems
            // console.log("sortFields checking...")
            // console.log(sortFields)
            // this.setState({ sortField_Items: _arrayItems },() => { console.log("SORT FIELD ITEMS UPDATED!!!");console.log(this.state.sortField_Items) })
        })
    }
    sortAdd = () => {
        this.setState({
            modalSort: !this.state.modalSort
        },() => {
            this.setState({
            selectedItems: []
            })
        })
    }
    sortAddCancel = () => {
        this.setState({
            modalSort: !this.state.modalSort
        },() => {
            
        })
    }
    sortAddSave = () => {
        //copy from selectedData
        let _selectedItems = Object.assign([], this.state.selectedSortItems)
        let _arrayItems = Object.assign([], this.state.arraySortItems)
        let _tempSelectedItem = {}
        let _isDuplicate = false
        let _duplicateNumber = 1
        let _tempNumber = ''
        console.log("_selectedItems:")
        console.log(_selectedItems)
        // { id: "0112002", label: "Account Code", group: "Loan", field:'Account_Code', fieldtransformed:'' }
        // console.log(" ITEMS BEFORE")
        // console.log(this.state.sortItems)
        for(let i=0;i<_selectedItems.length;i++) {
            //copy to new var to prevent overwrite previous data
            _tempSelectedItem = {}
            _duplicateNumber = 1
            //if fieldname is same, create auto field alias (unique)
            for(let j=0;j<_arrayItems.length;j++) {
                if(_selectedItems[i].id==_arrayItems[j].id) _isDuplicate = true
            }
            // if(_isDuplicate) {
            //     _selectedItems[i].label = _selectedItems[i].label+'_'                
            // }
            //rename id
            //_tempSelectedItem.id = this.selSortFieldId++//_arrayItems.length+1
            //_tempSelectedItem.fieldid = _selectedItems[i].id

            if(!_isDuplicate) {
                _tempSelectedItem.field = _selectedItems[i].field
                _tempSelectedItem.fieldid = _selectedItems[i].fieldid
                _tempSelectedItem.fieldtransformed = _selectedItems[i].fieldtransformed
                _tempSelectedItem.group = _selectedItems[i].group
                _tempSelectedItem.id = _selectedItems[i].id
                _tempSelectedItem.label = _selectedItems[i].label
                
                //push into list data
                _arrayItems.push(_tempSelectedItem)
            }            
        }
        this.setState({
            selectedSortItems:[],
            arraySortItems:_arrayItems,
            modalSort: !this.state.modalSort
        },()=>{
            this.props.updateParentState('sort_Data'+this.props.id,_arrayItems)
            console.log("arraySortItems:")
            console.log(this.state.arraySortItems)

            //get parent treedata to be modified : issortfields@parent state
            let _tempTreeData = Object.assign([],this.props.treeData)
            for(let i=0;i<_tempTreeData.length;i++) { if(_tempTreeData[i].id==this.props.id) _tempTreeData[i].issortfields = true }
            this.props.updateParentState('sourceTree_Data',_tempTreeData)
        })
    }
    render() {
        switch(this.props.panel) {
            case '00':
                return (
                    <div>
                        {/* <Row>Source / {this.findDataById(this.props.treeData,this.props.id,'title')}</Row> */}
                        <Card>
                            <CardHeader>
                            <strong><i className="fa fa-pencil"></i>&nbsp;Edit Source Name</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                    <Col xs="12" md="12">
                                        <Input type="text" id="sourcename" name="sourcename" placeholder="Please input sourcename" 
                                            valid={this.state.sourcenamevalid} invalid={this.state.sourcenameinvalid}
                                            value={this.state.sourcename} onChange={this.handleSourceChange} />
                                        <FormFeedback>{this.state['sourcenameinvalidmsg']}</FormFeedback>
                                    </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>
                );
            case '01':
                // if(this.props.filterData!=undefined) initValue = this.props.filterData
                // else initValue = defaultValue
                // console.log("ENTER CASE 01")
                // console.log(initValue)
                // console.log("CHECK FILTER FIELD STATE")
                // console.log(this.state.filterField_Items)
                return (
                    <div>
                        <Card>
                            <CardHeader><strong><i className="fa fa-filter"></i>&nbsp;Source Filter</strong></CardHeader>
                            <CardBody bodystyle={{padding: "0"}}>
                                {/* <QueryBuilder fields={fields} operators={operators} controlClassName={controlClassName}/> */}
                                {/* <QueryBuilderComponent /> */}
                                <Query 
                                    {...config_props}{...this.state.filterField_Items}
                                    value={loadTree(this.state.initValue)}
                                    get_children={this.getChildren}
                                    onChange={this.handleFiltersChange}
                                ></Query>
                            </CardBody>
                        </Card>
                    </div>
                );
            case '02':
                
                // console.log(this.props.fieldData)
                return (
                    <div>
                        {/* <Card>
                            <CardHeader><strong>Field Selector</strong></CardHeader>
                            <CardBody>
                                <MultiSelect
                                items={this.state.items}
                                selectedItems={this.props.fieldData}
                                onChange={this.handleMultiSelectChange}
                                height={380}
                                responsiveHeight={"380px"}
                                itemHeight={30}
                                withGrouping={true}
                                />
                            </CardBody>
                        </Card> */}
                    </div>
                );
            case '03':
                return (
                    <div>
                        <Card>
                            <CardHeader><strong><i className="fa fa-tasks"></i>&nbsp;Field Selection & Transformation</strong></CardHeader>
                            <CardBody>
                                <Button size="sm" color="light" id="btnFieldAdd" className="btn-pill" onClick={this.fieldAdd}>&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add Field&nbsp;</span></Button>
                                <Row>&nbsp;</Row>
                                <Row>
                                    <Col xs="5">
                                        <h6>Selected Fields ({this.state.arrayItems.length})</h6>
                                        <div style={{ display: 'block', height: 300, maxHeight: 330, marginLeft: 0, overflowY: 'scroll', overflowX: 'scroll', border:'1px solid #E5E4E2'}}>
                                            <SortableList items={this.state.arrayItems} 
                                                onSortEnd={this.onSortEnd} 
                                                updateArrayItems={this.updateArrayItems} 
                                                updateStateFromChild={this.updateStateFromChild}
                                                selectedItem={this.state.selectedArrayItems}
                                                removeArrayItem={this.removeArrayItem}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs="7">
                                        <SidePanelField data={this.state.selectedArrayItems} arrayItems={this.state.arrayItems}
                                            id={this.props.id}
                                            updateArrayItems={this.updateArrayItems} updateSelectedItems={this.updateSelectedItems} />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Modal isOpen={this.state.modalField} toggle={this.toggleModalField} className={'modal-lg ' + this.props.className}>
                            <ModalBody>
                                <Card>
                                <CardHeader>
                                    <strong>Add New Field</strong>
                                </CardHeader>
                                <CardBody>
                                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">                                    
                                    <FormGroup row>
                                        <Col md="2"><Label>Field</Label></Col>
                                        <Col xs="12" md="10">
                                        <MultiSelect
                                            //items={this.state.items}
                                            items={this.state.sourceField_Items}
                                            selectedItems={this.state.selectedItems}
                                            onChange={this.handleMultiSelectChange}
                                            height={300}
                                            responsiveHeight={"300px"}
                                            itemHeight={30}
                                            withGrouping={true}
                                        />
                                        {/* <FormFeedback>{this.state['sourcenameinvalidmsg']}</FormFeedback> */}
                                        </Col>
                                    </FormGroup>
                                    </Form>
                                </CardBody>
                                <CardFooter align="right">
                                    <Button color="secondary" onClick={this.fieldAddCancel}><i className="fa fa-close"></i>&nbsp;Cancel</Button>&nbsp;
                                    <Button color="primary" onClick={this.fieldAddSave}>&nbsp;<i className="fa fa-arrow-right"></i>&nbsp;Next&nbsp;</Button>{' '}
                                </CardFooter>
                                </Card>
                            </ModalBody>
                        </Modal>
                    </div>
                )
            case '04':
                return (
                    <div>
                        <Card>
                            <CardHeader><strong><i className="fa fa-sort-amount-asc"></i>&nbsp;Sort Order</strong></CardHeader>
                            <CardBody>
                                <Button size="sm" color="light" id="btnSortFieldAdd" className="btn-pill" onClick={this.sortAdd}>&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add Field&nbsp;</span></Button>
                                <Button size="sm" color="light" id="btnSortType" className="btn-pill">&nbsp;<i className="fa fa-sort-asc"></i>&nbsp;<span>Ascending&nbsp;</span></Button>
                                <Row>&nbsp;</Row>
                                <Row>
                                    <Col xs="12">
                                        <h6>Selected Fields ({this.state.arraySortItems.length})</h6>
                                        <div style={{ display: 'block', height: 300, maxHeight: 330, marginLeft: 0, overflowY: 'scroll', overflowX: 'scroll', border:'1px solid #E5E4E2'}}>
                                            <SortableSortList items={this.state.arraySortItems}
                                                onSortEnd={this.onSortSortFieldEnd}
                                                // updateArrayItems={this.updateArraySortItems} 
                                                // updateStateFromChild={this.updateStateFromChild}
                                                // selectedItem={this.state.selectedArrayItems}
                                                removeArrayItem={this.removeArraySortItem}
                                            />
                                        </div>
                                    </Col>
                                    
                                </Row>
                            </CardBody>
                        </Card>
                        <Modal isOpen={this.state.modalSort} toggle={this.toggleModalSort} className={'modal-lg ' + this.props.className}>
                            <ModalBody>
                                <Card>
                                <CardHeader>
                                    <strong>Add New Field Order</strong>
                                </CardHeader>
                                <CardBody>
                                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2"><Label>Category</Label></Col>
                                        <Col xs="12" md="10">
                                        <Input type="select" name="selectdatabase" id="selectdatabase">
                                            <option value="">ALL</option>
                                            
                                        </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2"><Label>Table</Label></Col>
                                        <Col xs="12" md="10">
                                        <MultiSelect
                                            items={this.state.sortField_Items}
                                            selectedItems={this.state.selectedSortItems}
                                            onChange={this.handleSortMultiSelectChange}
                                            height={300}
                                            responsiveHeight={"300px"}
                                            itemHeight={30}
                                        />
                                        {/* <FormFeedback>{this.state['sourcenameinvalidmsg']}</FormFeedback> */}
                                        </Col>
                                    </FormGroup>
                                    </Form>
                                </CardBody>
                                <CardFooter align="right">
                                    <Button color="secondary" onClick={this.sortAddCancel}><i className="fa fa-close"></i>&nbsp;Cancel</Button>&nbsp;
                                    <Button color="primary" onClick={this.sortAddSave}>&nbsp;<i className="fa fa-arrow-right"></i>&nbsp;Next&nbsp;</Button>{' '}
                                </CardFooter>
                                </Card>
                            </ModalBody>
                        </Modal>
                    </div>
                )
            case '10':
                return (
                    <div>
                        {/* <Row>Source / {this.findParentDataById(this.props.treeData,this.props.id,'title')}</Row>
                        <Row>Table / {this.findDataById(this.props.treeData,this.props.id,'title')}</Row>
                        <Card>
                            <CardHeader>
                            <strong>Edit Table</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                    <Col md="2"><Label>Database/Schema</Label></Col>
                                    <Col xs="12" md="10">
                                        <Input type="select" name="selectdatabase" id="selectdatabase">
                                        <option value="AReS_ST">Staging Data</option>
                                        </Input>
                                    </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                    <Col md="2"><Label>Table</Label></Col>
                                    <Col xs="12" md="10">
                                        <MultiSelect
                                        items={this.state.items}
                                        selectedItems={this.state.selectedItems}
                                        onChange={this.handleMultiSelectChange}
                                        height={250}
                                        responsiveHeight={"250px"}
                                        itemHeight={30}
                                        />
                                        <FormFeedback>{this.state['sourcenameinvalidmsg']}</FormFeedback>
                                    </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter align="right">
                                <Button color="secondary" onClick={this.sourceEditCancel}><i className="fa fa-close"></i>&nbsp;Cancel</Button>&nbsp;
                                <Button color="primary" onClick={this.sourceEditSave}>&nbsp;<i className="fa fa-save"></i>&nbsp;Save&nbsp;</Button>{' '}
                            </CardFooter>
                        </Card> */}
                    </div>
                );
            case '13':
                
                return (
                    <div>
                        <Card>
                            <CardHeader><strong><i className="fa fa-key"></i>&nbsp;Join Key</strong></CardHeader>
                            <CardBody bodystyle={{padding: "0"}}>
                                <Query 
                                    {...config_propsKey}{...this.state.keyField_Items}
                                    value={loadTree(this.state.initValueKey)}
                                    get_children={this.getChildren}
                                    onChange={this.handleKeysChange}
                                ></Query>
                            </CardBody>
                        </Card>
                    </div>
                );
            case '99':
                return(
                    <div></div>
                )
            default:
                return null;
        }
    }
}