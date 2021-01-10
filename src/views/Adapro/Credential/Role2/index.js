import React,{useState, useEffect} from 'react';
import API from 'api';
import {Paper} from '@material-ui/core'
import Table from './../../../../components/TableRole'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../../components/popupAll'
   

const Depart = React.memo(() =>{
    let token = localStorage.getItem('id_token');
    const [dataRoleAll, setDataRoleAll] = useState([]);
    const [open, setOpen] = useState(false);
    const [actionForm, setActionForm] = useState('');
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupRole.isOpen);
    const dispatch = useDispatch();
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
      }, [])
    const rowAdd =  React.useCallback(()=>{
        dispatch(kirimisOpenDepart(true))
        setOpen(true);
        setActionForm("Add Role")
    },[dataSelected])
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
            for(let i=0;i<dataSelected.selectedId.length;i++){
                let token = localStorage.getItem('id_token');
             
                API.post("/credential_service/delete_role",{
                  key: token,
                  group_id: dataSelected.selectedId[i]
                }).then(data => {
                alert("Role ID "+dataSelected.selectedId[i]+" "+data.data.data);
                getRoleAll();
               
              }).catch(err=>{
                  alert(err)
              })
            }
        }

    },[dataSelected])
    const getRoleAll = React.useCallback(()=>{
        API.post("/credential_service/get_role",{
            key: token,
            info_data:'all'
        }).then(data => {
            setDataRoleAll(data.data.data);
           
           
           
          
            
          
        })
    },[setDataRoleAll])
    useEffect(()=>{
        getRoleAll();
        setOpen(popupDepart)
       
    },[popupDepart])
    return(
    <div>
        <Button color="dark" id="btnRowAdd" className="btn-pill" onClick={rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button>
        {dataSelected.selectedUser>0?<Button color="danger" id="btnRowDelete" className="btn-pill" onClick={rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button>:''}
        {dataSelected.selectedUser==1?<Button color="warning" id="btnTableEdit" className="btn-pill" onClick={rowEdit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-edit"></i>&nbsp;<span>Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null}

        
        <Table data={dataRoleAll} groupName={""}></Table>
        <Dialog open={open} actionForm={actionForm}></Dialog>


    </div>    
    );
})

export default Depart;