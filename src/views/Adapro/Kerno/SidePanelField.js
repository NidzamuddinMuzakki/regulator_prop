import React, { Component } from 'react';
import { Input, Row, Col, Label, Form, FormGroup, FormFeedback } from 'reactstrap';

export default class SidePanelField extends Component {
    constructor(props) {
        super(props);
        
        this.state={
            label: this.props.data.label,
            labelvalid: false,
            labelinvalid: false,
            labelinvalidmsg: '',
            fieldtransformed: this.props.fieldtransformed,
            fieldtransformedvalid: false,
            fieldtransformedinvalid: false,
            fieldtransformedinvalidmsg: ''
        }
        this.stateKeeper={
            label:''
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.data !== this.props.data){
            this.setState({
                label:nextProps.data.label,
                labelvalid: false,
                labelinvalid: false,
                labelinvalidmsg: '',
                fieldtransformed:nextProps.data.fieldtransformed
            });
            this.stateKeeper.label = nextProps.data.label
        } else if(nextProps.id!== this.props.id) {
            this.setState({
                label:undefined,
            });
            this.props.updateSelectedItems({})
        }
    }
    updateLocalState = (e) => {
        this.setState({
            labelvalid:true,
            labelinvalid:false,
            labelinvalidmsg:''
        },()=> {
            
        })

        let _regex
        let _inputInvalid, _inputInvalidMsg
        if(e.target.name=='label') {
            _inputInvalid = false
            for(let i=0;i<this.props.arrayItems.length;i++) {
                if(this.props.arrayItems[i].label.toString().toLowerCase()==e.target.value.toString().toLowerCase()) {
                    _inputInvalid = true
                    _inputInvalidMsg = 'Failed to save! Duplicated Field Alias.'
                }
            }

            _regex = /[^A-Za-z0-9\s_]+/
            if(_regex.test(e.target.value)) {
                _inputInvalid = true
                _inputInvalidMsg = 'Failed to save! Allowed characters are alphabets, number, space, and underscore.'
            }

            if(e.target.value.toString().trim()=='') {
                _inputInvalid = true
                _inputInvalidMsg = 'Failed to save! Alias must be filled.'
            }

            if(_inputInvalid) {
                this.setState({
                    labelvalid:false,
                    labelinvalid:true,
                    labelinvalidmsg:_inputInvalidMsg
                },() => {
                    
                })
            } else {
                this.stateKeeper.label = this.state.label
            }

        }
        
        this.setState({
            [e.target.name]: e.target.value,
        }, () => {
            // console.log("Print StateKeeper before -> "+this.stateKeeper.label)
            // console.log(this.state.labelvalid)
            if(this.state.labelvalid==true) this.stateKeeper.label = this.state.label
            // console.log("Print StateKeeper after -> "+this.stateKeeper.label)
            this.props.updateArrayItems(this.props.data.id,{label:this.stateKeeper.label,fieldtransformed:this.state.fieldtransformed})
        })
    }
    
    render() {
        // console.log(this.state)
        // console.log(this.props.data)
        return(
            this.state.label==undefined?
                <div></div>
            :
                <div>
                    <Row><h6>Field Detail</h6></Row>
                    
                    <Row>
                        <span className="h5"><i className="fa fa-caret-square-o-right"/>&nbsp;{this.props.data.field}</span>
                    </Row>
                    <Row>
                        <Label><i className="fa fa-id-card"/>&nbsp;Field Alias</Label>
                        <Input type="text" id="label" name="label" placeholder="Please input alias" 
                            value={this.state.label} onChange={this.updateLocalState}
                            valid={this.state['labelvalid']} invalid={this.state['labelinvalid']}/>
                        <FormFeedback>{this.state['labelinvalidmsg']}</FormFeedback>
                    </Row>
                    <Row>&nbsp;</Row>
                    <Row>
                        <Label><i className="fa fa-cogs"/>&nbsp;Field Logic</Label>
                        <Input type="textarea" 
                            id="fieldtransformed" name="fieldtransformed" rows="6" 
                            value={this.state.fieldtransformed} onChange={this.updateLocalState}/>
                    </Row>
                    
                </div>
        )
    } 
}