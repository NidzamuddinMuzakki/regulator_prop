import React, {Component} from 'react';
import {Query, Builder, BasicConfig, Utils as QbUtils} from 'react-awesome-query-builder';
import API from './../../api/api';
import { Button,Col, Modal, ModalBody,  Form,
  FormGroup,
 FormFeedback, 
  Card,
  CardBody,
  CardFooter,
  CardHeader,Label,Input,
  } from 'reactstrap'
// For AntDesign widgets only:
import AntdConfig from 'react-awesome-query-builder/lib/config/antd';
import 'react-awesome-query-builder/css/antd.less'; // or import "antd/dist/antd.css";
// For Material-UI widgets only:
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
// Choose your skin (ant/material/vanilla):
import ConfigM from './Kerno/configKey'
 
import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css'; //optional, for more compact styles

const InitialConfig = MaterialConfig; // or MaterialConfig or BasicConfig
// You need to provide your own config. See below 'Config format'
// const config = {
//   ...InitialConfig,
//   fields: {
//     qty: {
//         label: 'Qty',
//         type: 'number',
//         fieldSettings: {
//             min: 0,
//         },
//         valueSources: ['value'],
//         preferWidgets: ['number'],
//     },
//     price: {
//         label: 'Price',
//         type: 'number',
//         valueSources: ['value'],
//         fieldSettings: {
//             min: 10,
//             max: 100,
//         },
//         preferWidgets: ['slider', 'rangeslider'],
//     },
//     color: {
//         label: 'Color',
//         type: 'select',
//         valueSources: ['value'],
//         fieldSettings: {
//           listValues: [
//             { value: 'yellow', title: 'Yellow' },
//             { value: 'green', title: 'Green' },
//             { value: 'orange', title: 'Orange' }
//           ],
//         }
//     },
//     is_promotion: {
//         label: 'Promo?',
//         type: 'boolean',
//         operators: ['equal'],
//         valueSources: ['value'],
//     },
//   }
// };
 
// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = {"id": QbUtils.uuid(), "type": "group"};
 
 
export default class DemoQueryBuilder extends Component {
    constructor(props){
      super(props);
      this.state = {
        tree: '',
        config: {
            ...InitialConfig,
  fields: {
    qty: {
        label: 'Qty',
        type: 'number',
        fieldSettings: {
            min: 0,
        },
        valueSources: ['value'],
        preferWidgets: ['number'],
    },
    price: {
        label: 'Price',
        type: 'number',
        valueSources: ['value'],
        fieldSettings: {
            min: 10,
            max: 100,
        },
        preferWidgets: ['slider', 'rangeslider'],
    },
    color: {
        label: 'Color',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: [
            { value: 'yellow', title: 'Yellow' },
            { value: 'green', title: 'Green' },
            { value: 'orange', title: 'Orange' }
          ],
        }
    },
    is_promotion: {
        label: 'Promo?',
        type: 'boolean',
        operators: ['equal'],
        valueSources: ['value'],
    },
  }
        },
        schema:[],
        data:[]
      };
    }  
    componentWillMount() {
     
     this.setState({
       tree:QbUtils.checkTree(QbUtils.loadTree(queryValue), this.state.config),
      
     })
      
     }
  
   
    componentDidUpdate(sss, prev){
      if(prev.data!==this.props.data){
        this.setState({
            schema:this.props.schema,
            data:this.props.data
        })
        const obj = {} 
        
        for(const key of this.state.schema){
          let arr = []
          for(let i=0;i<this.state.data.length;i++){
              if(i==0 || this.state.data[i-1][key]!=this.state.data[i][key]){
                arr.push({value: this.state.data[i][key],title:this.state.data[i][key]})

              }
            
            
          }
          if(this.props.name=="user" || this.props.name=="role"){
            
                obj[key] = {
                  label: key.split(".")[1],
                  type: 'select',
                  valueSources: ['value'],
                  fieldSettings: {
                    listValues: arr
                  }
              
              }
          }else{
            obj[key] = {
              label: key,
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                listValues: arr
              }
          
          }
          }
         
          
        }
       
        this.setState({
          config:  {
            ...InitialConfig,
            fields:obj
              
            
          }
        })
         
          
        
        
      }
    }
    cari=()=>{
      let Stringsql = QbUtils.sqlFormat(this.state.tree, this.state.config);
      let token = localStorage.getItem('id_token');
      console.log(this.props.name)
   if(this.props.name=="user"){

    console.log(Stringsql)
     API.post("get_user",{
       key: token,
       ficos: Stringsql,
       info_data:'all'
     }
     
     ).then(data => {
       
    //  alert(data.data.data)
      this.props.onClick(data.data.data)
     
       // this.setState({
       //   dataSet: data.data.data
       // });
     
     }).catch(error=>{
       alert(error)
     })
     
   }else if(this.props.name=="group"){
    
     this.props.onClick(Stringsql)
      // this.setState({
      //   dataSet: data.data.data
      // });

    
   }else if(this.props.name=="role"){
    API.post("get_role",{
      key: token,
      ficos: Stringsql,
      info_data:'all'
    }
    
    ).then(data => {
      
    
     this.props.onClick(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    })
    
   }else if(this.props.name=="depart"){
   
     this.props.onClick(Stringsql)
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    
    
   }else if(this.props.name=="branch"){
    API.post("/credential_service/get_branch",{
      key: token,
      ficos: Stringsql,
      info_data:'all'
    }
    
    ).then(data => {
      
     console.log(data)
     this.props.onClick(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    })
    
   }

      
    }
    render = () => (
      <div style={{marginTop:'5px'}}>
        <Button style={{marginLeft:'13px'}} className="btn-pill" color="warning" onClick={this.reset}>Reset</Button>
        <Button className="btn-pill" color="primary" onClick={this.cari}>Cari</Button>
        <Query
            
            {...this.state.config} 
            value={this.state.tree}
            onChange={this.onChange}
            renderBuilder={this.renderBuilder}
        />
        {/* {this.renderResult(this.state)} */}
      </div>
    )
    reset = ()=>{
        this.setState({
         
              tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), this.state.config), 
        
        })
    }
    renderBuilder = (props) => (
      <div className="query-builder-container" style={{marginTop: '-10px', marginBottom:'0px'}}>
        <div className="query-builder">
            <Builder {...props} />
        </div>
      </div>
    )
 
    // renderResult = ({tree: immutableTree, config}) => (
    //   // <div className="query-builder-result">
    //   //     <div>Query string: <pre>{JSON.stringify(QbUtils.queryString(immutableTree, config))}</pre></div>
    //   //     <div>MongoDb query: <pre>{JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}</pre></div>
    //   //     <div>SQL where: <pre>{JSON.stringify(QbUtils.sqlFormat(immutableTree, config))}</pre></div>
    //   //     <div>JsonLogic: <pre>{JSON.stringify(QbUtils.jsonLogicFormat(immutableTree, config))}</pre></div>
    //   // </div>
    //   JSON.stringify(QbUtils.sqlFormat(immutableTree, config))
    // )
    
    onChange = (immutableTree, config) => {
      // Tip: for better performance you can apply `throttle` - see `examples/demo`
      this.setState({tree: immutableTree, config: config});
 
      // const jsonTree = QbUtils.getTree(immutableTree);
     
      // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    }
}