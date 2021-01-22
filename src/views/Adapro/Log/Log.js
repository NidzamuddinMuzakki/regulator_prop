import React,{useState, useEffect} from 'react';
import API from 'api';
import {Paper} from '@material-ui/core'
import Table from './../../../components/TableLog/index'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../components/PopUpLog/PopUpLog'
import Tooltip from '@material-ui/core/Tooltip';  
import Filterdata from './../filter';
import Skeleton from './../../../components/Skeleton';
import { 
  Card,
  CardBody,
  CardFooter,
  CardHeader,Label,Input,
  } from 'reactstrap';


import {Query, Builder, BasicConfig, Utils as QbUtils} from 'react-awesome-query-builder';
const Log = React.memo(() =>{
    let token = localStorage.getItem('id_token');
    const [dataLogAll, setLogAll] = useState([]);
    const [open, setOpen] = useState(false);
    const [filterOpen, setfilterOpen] = useState(false);
    const [groupName, setGroupName] = React.useState([]);
    const [actionForm, setActionForm] = useState('');
    const [selectedDetail, setSelectedDetail] = useState(0);
    const userAccess = useSelector(state=>state.userAcces);
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupDepart.isOpen);
    const rowperpageDepart = useSelector(state=>state.rowperpageLog);
    const [jumlahdata, setJumlahData] = useState(5);
    const MenuAccess = useSelector(state=>state.MenuAccess);
    const [loading, setLoading] = useState(false);
    const [Menu , setMenu] = useState({
      access_view:false,
      access_create:false,
      access_update:false,
      access_delete:false
    })
    const [schema, setSchema] = React.useState([]);
    const dispatch = useDispatch();
    const kirimisOpenDepart = (isOpen) => {
        return {
          type: "OPENDEPART",
          payload: {
            isOpen: isOpen,
          }
        }
      }
    const kirimSelected = (jumlah, data) => {
        return {
          type: "SELECTEDUSER",
          payload: {
            selectedUser: jumlah,
            selectedId:data
          }
        }
      }  
      useEffect(()=>{
        dispatch(kirimSelected(0,[]))  
        for(const key of MenuAccess.menu){
          if(key.name=="log"){
            setMenu({
              access_view:(key.access_view ==="true"),
              access_create:(key.access_create ==="true"),
              access_update:(key.access_update ==="true"),
              access_delete:(key.access_delete ==="true")
            })
          }
        }
      }, [])
      const getGroupDetail = React.useCallback((id) => {  //on startup function
        let token = localStorage.getItem('id_token');
    
        API.post("/get_group", {
          key: token,
          group_id: id,
          info_data: "detail"
        }).then(data => {
          let uaja = data.data.data;
          
          setGroupName( arr => [...arr, uaja.group_name]);
        })
        
    },[setGroupName])

    const rowAdd =  React.useCallback(()=>{
        dispatch(kirimisOpenDepart(true))
        setOpen(true);
        setActionForm("Add Department")
    }, [dataSelected])
    const rowEdit = React.useCallback( ()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            dispatch(kirimisOpenDepart(true))
            setOpen(true);
            setActionForm("Edit Department")

        }
    }, [dataSelected])
    const tableFilter  = React.useCallback(()=>{
      if(filterOpen==true){
        setfilterOpen(false)
        

      }else{
        setfilterOpen(true)
      }
    }, [filterOpen])
    const rowDelete = React.useCallback( ()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
         
          
            
          let hasil = '';
          var fetches = [];
            for(let i=0;i<dataSelected.selectedId.length;i++){
                let token = localStorage.getItem('id_token');
             
                fetches.push(API.post("delete_department",{
                  key: token,
                  dept_id: dataSelected.selectedId[i]
                }).then(data => {
               hasil = hasil +"Department ID "+dataSelected.selectedId[i]+" "+data.data.data+"\n";
               
               
              }).catch(err=>{
                  alert(err);
              })
                )}

            Promise.all(fetches).then(function(){
              alert(hasil);
              getLogAll(rowperpageDepart.halaman, rowperpageDepart.jumlah);

            })    
           
        }

    },[dataSelected])
    const getSelected = React.useCallback((data)=>{
        setOpen(true)
        setSelectedDetail(data)
    }, [])
    
    const renderAll = React.useCallback((data)=>{
      dispatch(kirimSelected(0,[]))  
      getLogAll(rowperpageDepart.halaman, rowperpageDepart.jumlah,data)
  }, [setLogAll])
    const getLogAll = React.useCallback((hal, rowperpage,ficos='')=>{
      setLoading(true)  
  
      API.post("get_log",{
            key: token,
            info_data:'all',
            ficos:ficos,
            per_page:rowperpage,
            page:hal
        }).then(data => {
            setLogAll(data.data.data);
            setSchema(Object.keys(data.data.data[0]));
            setJumlahData(data.data.count_data);
            setLoading(false);
            
          
        })
    },[setLogAll,rowperpageDepart.halaman,rowperpageDepart.jumlah])
  
    useEffect(()=>{
      

        getLogAll(rowperpageDepart.halaman,rowperpageDepart.jumlah);
        
       
       
        setOpen(open)
       
    },[open,rowperpageDepart.halaman,rowperpageDepart.jumlah])
    return(
    <div style={{marginTop:'-22px'}}>
        {/* <Button color="dark" id="btnRowAdd" className="btn-pill" onClick={rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button>
        {dataSelected.selectedUser>0?<Button color="danger" id="btnRowDelete" className="btn-pill" onClick={rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button>:''}
        {dataSelected.selectedUser==1?<Button color="warning" id="btnTableEdit" className="btn-pill" onClick={rowEdit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-edit"></i>&nbsp;<span>Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null} */}
        {!loading?
        <div>
        { Menu.access_create==true? 
        <Tooltip title="Add Department" aria-label="Add Department">
         
         <Button  id="btnRowAdd" className="btn-pill btn-outline-dark btn-m" style={{fontSize:'20px'}} onClick={rowAdd}><i className="fa fa-plus-square"></i></Button>
          
         
       </Tooltip>
        
        :''}
       {dataSelected.selectedUser>0  && Menu.access_delete==true?  <Tooltip title="Delete Department" aria-label="Delete Department"><Button style={{fontSize:'20px', marginLeft:'5px'}}  id="btnRowDelete" className="btn-pill btn-outline-danger btn-m" onClick={rowDelete}><i className="fa fa-window-close"></i></Button></Tooltip>:''}
       {dataSelected.selectedUser==1  && Menu.access_update==true?<Tooltip title="Edit Department" aria-label="Edit Department"><Button color="warning" id="btnTableEdit" className="btn-pill btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={rowEdit}><i className="fa fa-edit"></i></Button></Tooltip> : null}
       <Tooltip title="Filter User" aria-label="Filter User"><Button  id="btnFilter"  className="btn-pill btn-outline-light btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={tableFilter}><i className="fa fa-filter"></i></Button></Tooltip>
       
       {filterOpen? 
                        
                       
                           
                          <div>
                                <Filterdata data={dataLogAll} onClick={renderAll} name={"Log"} schema={schema}  jumlahdata={jumlahdata} groupName={groupName}></Filterdata>
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

                            
</div>

                        :'' }
        <Table data={dataLogAll} schema={schema} jumlahdata={jumlahdata} onClick={getSelected} groupName={groupName}></Table>
        <Dialog open={open} selectedDetail={selectedDetail} onClick={(open)=>{setOpen(open)}} actionForm={actionForm}></Dialog>
        </div>

        :<Skeleton></Skeleton>}
        
    </div>    
    );
})

export default Log;