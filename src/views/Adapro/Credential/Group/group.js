import React,{useState, useEffect} from 'react';
import API from 'api';
import {Paper} from '@material-ui/core'
import Table from './../../../../components/TableGroup'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../../components/popupAll'
   

const Depart = React.memo(() =>{
    let token = localStorage.getItem('id_token');
    const [dataGroupAll, setDataGroupAll] = useState([]);
    const [open, setOpen] = useState(false);
    const [actionForm, setActionForm] = useState('');
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupGroup.isOpen);
    const dispatch = useDispatch();
    const kirimisOpenDepart = (isOpen) => {
        return {
          type: "OPENGROUP",
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
    const rowAdd =  ()=>{
        dispatch(kirimisOpenDepart(true))
        setOpen(true);
        setActionForm("Add Group")
    }
    const rowEdit =  ()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            dispatch(kirimisOpenDepart(true))
            setOpen(true);
            setActionForm("Edit Group")

        }
    }
    const rowDelete =  ()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            for(let i=0;i<dataSelected.selectedId.length;i++){
                let token = localStorage.getItem('id_token');
             
                API.post("/credential_service/delete_group",{
                  key: token,
                  group_id: dataSelected.selectedId[i]
                }).then(data => {
                alert("Group ID "+dataSelected.selectedId[i]+" "+data.data.data);
                getGroupAll();
               
              }).catch(err=>{
                  alert(err)
              })
            }
        }

    }
    const getGroupAll = ()=>{
        API.post("/credential_service/get_group",{
            key: token,
            info_data:'all'
        }).then(data => {
            setDataGroupAll(data.data.data);
           
           
           
          
            
          
        })
    }
    useEffect(()=>{
        getGroupAll();
        setOpen(popupDepart)
       
    },[popupDepart])
    return(
    <div>
        <Button color="dark" id="btnRowAdd" className="btn-pill" onClick={rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button>
        {dataSelected.selectedUser>0?<Button color="danger" id="btnRowDelete" className="btn-pill" onClick={rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button>:''}
        {dataSelected.selectedUser==1?<Button color="warning" id="btnTableEdit" className="btn-pill" onClick={rowEdit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-edit"></i>&nbsp;<span>Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null}

        
        <Table data={dataGroupAll} groupName={""}></Table>
        <Dialog open={open} actionForm={actionForm}></Dialog>


    </div>    
    );
})

export default Depart;