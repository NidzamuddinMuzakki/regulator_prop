import React,{useState, useEffect} from 'react';
import API from 'api';
import {Paper} from '@material-ui/core'
import Table from './../../../../components/TableRole'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../../components/popupAll'
import Tooltip from '@material-ui/core/Tooltip';  
import Filterdata from './../../filter';
import Skeleton from './../../../../components/Skeleton'
import { saveAs } from 'file-saver';
import axios from 'axios'
import { 
  Card,
  CardBody,
  CardFooter,
  CardHeader,Label,Input,
  } from 'reactstrap';


import {Query, Builder, BasicConfig, Utils as QbUtils} from 'react-awesome-query-builder';
const Depart = React.memo(() =>{
    let token = localStorage.getItem('id_token');
    const [dataRoleAll, setDataRoleAll] = useState([]);
    const [open, setOpen] = useState(false);
    const MenuAccess = useSelector(state=>state.MenuAccess);
    const [Menu , setMenu] = useState({
      access_view:false,
      access_create:false,
      access_update:false,
      access_delete:false
    })
    const [actionForm, setActionForm] = useState('');
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupRole.isOpen);
    const [filterOpen, setfilterOpen] = useState(false);
    const userAccess = useSelector(state=>state.userAcces);
    const rowperpageRole = useSelector(state=>state.rowperpageRole);
    const [jumlahdata, setJumlahData] = useState(5);
    const dispatch = useDispatch();
    const [schema, setSchema] = useState([]);
    const [schema1, setSchema1] = useState([]);
   const [dataMenuAction,setDataMenuAction]=useState([]);
    const [dataRoleFilter, setDataRoleFilter] = useState([]);
    const kirimisOpenDepart = (isOpen) => {
        return {
          type: "OPENROLE",
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
          if(key.name=="role"){
            setMenu({
              access_view:(key.access_view ==="true"),
              access_create:(key.access_create ==="true"),
              access_update:(key.access_update ==="true"),
              access_delete:(key.access_delete ==="true")
            })
          }
        }
      }, [])
      const getMenuAction = React.useCallback(()=>{
        let token = localStorage.getItem('id_token');
        API.post("get_menu", {
          key: token,
          info_data: "all"
        }).then(data => {
          // let uaja = data.data.data;
          let ambil = []
          for(const uaja of data.data.dataOrigin){
              
              if(uaja.url!=''){
                ambil.push({"Name":uaja.name,"View":true,"Create":true, "Update":true, "Delete":true});
              }
          }
          setDataMenuAction(ambil);
         
         
        })
      },[setDataMenuAction] )
    const rowAdd =  React.useCallback(()=>{
        dispatch(kirimisOpenDepart(true))
        setOpen(true);
        setActionForm("Add Role")
    },[dataSelected])
    const tableDownload = () => { //download
      let token = localStorage.getItem('id_token');
      axios.post('http://34.101.137.61:22112/credential_service/download_excel', { 
        responseType: 'arraybuffer' , 
     
          key:token,
          data:'role'
        
        })
        .then((response) => {
          saveAs(new Blob([new Uint8Array(response.data.file_excel.data)],{type:"application/octet-stream"}), 'role.xlsx');
        });
      }
    const renderAll = React.useCallback((data)=>{
        setDataRoleAll(data)
    }, [setDataRoleAll])
    const rowEdit = React.useCallback(()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            dispatch(kirimisOpenDepart(true))
            setOpen(true);
            setActionForm("Edit Role")

        }
    },[dataSelected])
    const rowDelete = React.useCallback(()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
          let token = localStorage.getItem('id_token');
            for(let i=0;i<dataSelected.selectedId.length;i++){
                
             
                API.post("delete_role",{
                  key: token,
                  role_id: dataSelected.selectedId[i]
                }).then(data => {
                alert("Role ID "+dataSelected.selectedId[i]+" "+data.data.data);
                
               
              }).catch(err=>{
                  alert(err)
              })
            }
            getRoleAll();
        }

    },[dataSelected])
    const tableFilter  = React.useCallback(()=>{
      if(filterOpen==true){
        setfilterOpen(false)
        

      }else{
        setfilterOpen(true)
      }
    }, [filterOpen])
    const getRoleAll = React.useCallback((jumlah, halaman)=>{
        API.post("get_role",{
            key: token,
            info_data:'all',
            per_page:jumlah,
            page:halaman
        }).then(data => {
            setDataRoleAll(data.data.data);
           setSchema(Object.keys(data.data.data[0]))
            setJumlahData(data.data.count_data);
            setSchema1(Object.keys(data.data.field_filter_name[0]))
           setDataRoleFilter(data.data.field_filter_name);
          
            
          
        })
    },[setDataRoleAll])
    useEffect(()=>{
      getRoleAll(rowperpageRole.jumlah, rowperpageRole.halaman);
      setOpen(popupDepart)
      getMenuAction();
    },[popupDepart,rowperpageRole.jumlah, rowperpageRole.halaman])
    
    return(
    <div style={{marginTop:'-22px'}}>

      {dataRoleAll.length>0?
      <div>
      { Menu.access_create==true?
      <Tooltip title="Add Role" aria-label="Add Role">
        <Button  id="btnRowAdd" className="btn-pill btn-outline-dark btn-m" style={{fontSize:'20px'}} onClick={rowAdd}><i className="fa fa-plus-square"></i></Button>
      </Tooltip>
      
      :''}
     
        {dataSelected.selectedUser>0 && Menu.access_delete==true?<Tooltip title="Delete Role" aria-label="Delete Role"><Button  id="btnRowDelete" style={{fontSize:'20px',marginLeft:"5px"}} className="btn-pill btn-outline-danger btn-m" onClick={rowDelete}><i className="fa fa-window-close"></i></Button></Tooltip>:''}

    
    
        {dataSelected.selectedUser==1  && Menu.access_update==true?<Tooltip title="Edit Role" aria-label="Edit Role"><Button color="warning" style={{fontSize:'20px',marginLeft:"5px"}} id="btnTableEdit" className="btn-pill  btn-m" onClick={rowEdit}><i className="fa fa-edit"></i></Button></Tooltip> : null}

        <Tooltip title="Filter Role" aria-label="Filter Role"><Button  id="btnFilter"  className="btn-pill btn-outline-light btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={tableFilter}><i className="fa fa-filter"></i></Button></Tooltip>
        <Tooltip title="Download Role" aria-label="Download Role"><Button  id="btnDownload"  className="btn-pill btn-outline-info btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={tableDownload}><i className="fa fa-cloud-download"></i></Button></Tooltip>
    
        {filterOpen? 
                        
                        <Card>
                            <CardHeader><strong><i className="fa fa-filter"></i>&nbsp;Source Filter</strong></CardHeader>
                            <CardBody bodystyle={{padding: "0"}}>
                                <Filterdata data={dataRoleFilter} schema={schema1} onClick={renderAll} name="role" jumlahdata={jumlahdata} groupName={""}></Filterdata>
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
        
        <Table data={dataRoleAll} name="role" schema={[...schema]} jumlahdata={jumlahdata} groupName={""}></Table>
        <Dialog open={open} actionForm={actionForm} dataMenuAction={dataMenuAction}></Dialog>
        </div>
      :<Skeleton></Skeleton>}
      

    </div>    
    );
})

export default Depart;