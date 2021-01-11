import React,{useState, useEffect} from 'react';
import API from 'api';
import {Paper} from '@material-ui/core'
import Table from './../../../../components/TableDepart'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../../components/popupAll'
import Tooltip from '@material-ui/core/Tooltip';  

const Depart = React.memo(() =>{
    let token = localStorage.getItem('id_token');
    const [dataDepartementAll, setDataDepartementAll] = useState([]);
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = React.useState([]);
    const [actionForm, setActionForm] = useState('');
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupDepart.isOpen);
    const rowperpageDepart = useSelector(state=>state.rowperpageBranch);
    const [jumlahdata, setJumlahData] = useState(0);
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
      
      }, [])
      const getGroupDetail = React.useCallback((id) => {  //on startup function
        let token = localStorage.getItem('id_token');
    
        API.post("/credential_service/get_group", {
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
    const rowDelete = React.useCallback( ()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
         
          
            
          let hasil = '';
          var fetches = [];
            for(let i=0;i<dataSelected.selectedId.length;i++){
                let token = localStorage.getItem('id_token');
             
                fetches.push(API.post("/credential_service/delete_department",{
                  key: token,
                  dept_id: dataSelected.selectedId[i]
                }).then(data => {
               hasil = hasil +"User ID "+dataSelected.selectedId[i]+" "+data.data.data+"\n";
               
               
              }).catch(err=>{
                  alert(err);
              })
                )}

            Promise.all(fetches).then(function(){
              alert(hasil);
              getDepartAll();

            })    
           
        }

    },[dataSelected])
    const getDepartAll = React.useCallback((hal, rowperpage)=>{
        API.post("/credential_service/get_department",{
            key: token,
            info_data:'all',
            per_page:rowperpage,
            page:hal
        }).then(data => {
            setDataDepartementAll(data.data.data);
            setJumlahData(data.data.count_data);
            let depart = data.data.data;
           
            for(let i=0;i<depart.length;i++){
                getGroupDetail(depart[i].group_id)
            }
          
            
          
        })
    },[setDataDepartementAll,,rowperpageDepart.halaman,rowperpageDepart.jumlah])
    useEffect(()=>{
        getDepartAll(rowperpageDepart.halaman,rowperpageDepart.jumlah);
       
       
        setOpen(popupDepart)
       
    },[popupDepart,rowperpageDepart.halaman,rowperpageDepart.jumlah])
    return(
    <div>
        {/* <Button color="dark" id="btnRowAdd" className="btn-pill" onClick={rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button>
        {dataSelected.selectedUser>0?<Button color="danger" id="btnRowDelete" className="btn-pill" onClick={rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button>:''}
        {dataSelected.selectedUser==1?<Button color="warning" id="btnTableEdit" className="btn-pill" onClick={rowEdit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-edit"></i>&nbsp;<span>Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null} */}
 <Tooltip title="Add Department" aria-label="Add Department">
         
         <Button  id="btnRowAdd" className="btn-pill btn-outline-dark btn-m" style={{fontSize:'20px'}} onClick={rowAdd}><i className="fa fa-plus-square"></i></Button>
          
         
       </Tooltip>
       {dataSelected.selectedUser>0?  <Tooltip title="Delete Department" aria-label="Delete Department"><Button style={{fontSize:'20px'}}  id="btnRowDelete" className="btn-pill btn-outline-danger btn-m" onClick={rowDelete}><i className="fa fa-window-close"></i></Button></Tooltip>:''}
       {dataSelected.selectedUser==1?<Tooltip title="Edit Department" aria-label="Edit Department"><Button color="warning" id="btnTableEdit" className="btn-pill btn-m" style={{fontSize:'20px'}} onClick={rowEdit}><i className="fa fa-edit"></i></Button></Tooltip> : null}
        
        <Table data={dataDepartementAll}  jumlahdata={jumlahdata} groupName={groupName}></Table>
        <Dialog open={open} actionForm={actionForm}></Dialog>


    </div>    
    );
})

export default Depart;