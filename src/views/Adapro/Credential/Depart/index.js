import React,{useState, useEffect} from 'react';
import API from 'api';
import {Paper} from '@material-ui/core'
import Table from './../../../../components/TableDepart'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../../components/popupAll'
   

const Depart = React.memo(() =>{
    let token = localStorage.getItem('id_token');
    const [dataDepartementAll, setDataDepartementAll] = useState([]);
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = React.useState([]);
    const [actionForm, setActionForm] = useState('');
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupDepart.isOpen);
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
      const getGroupDetail = (id) => {  //on startup function
        let token = localStorage.getItem('id_token');
    
        API.post("/credential_service/get_group", {
          key: token,
          group_id: id,
          info_data: "detail"
        }).then(data => {
          let uaja = data.data.data;
          
          setGroupName( arr => [...arr, uaja.group_name]);
        })
        
    }

    const rowAdd =  ()=>{
        dispatch(kirimisOpenDepart(true))
        setOpen(true);
        setActionForm("Add Department")
    }
    const rowEdit =  ()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            dispatch(kirimisOpenDepart(true))
            setOpen(true);
            setActionForm("Edit Department")

        }
    }
    const rowDelete =  ()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            for(let i=0;i<dataSelected.selectedId.length;i++){
                let token = localStorage.getItem('id_token');
             
                API.post("/credential_service/delete_department",{
                  key: token,
                  dept_id: dataSelected.selectedId[i]
                }).then(data => {
                alert("User ID "+dataSelected.selectedId[i]+" "+data.data.data);
                getDepartAll();
               
              }).catch(err=>{
                  alert(err);
              })
            }
        }

    }
    const getDepartAll = ()=>{
        API.post("/credential_service/get_department",{
            key: token,
            info_data:'all'
        }).then(data => {
            setDataDepartementAll(data.data.data);
            let depart = data.data.data;
           
            for(let i=0;i<depart.length;i++){
                getGroupDetail(depart[i].group_id)
            }
          
            
          
        })
    }
    useEffect(()=>{
        getDepartAll();
        setOpen(popupDepart)
       
    },[popupDepart])
    return(
    <div>
        <Button color="dark" id="btnRowAdd" className="btn-pill" onClick={rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button>
        {dataSelected.selectedUser>0?<Button color="danger" id="btnRowDelete" className="btn-pill" onClick={rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button>:''}
        {dataSelected.selectedUser==1?<Button color="warning" id="btnTableEdit" className="btn-pill" onClick={rowEdit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-edit"></i>&nbsp;<span>Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null}

        
        <Table data={dataDepartementAll} groupName={groupName}></Table>
        <Dialog open={open} actionForm={actionForm}></Dialog>


    </div>    
    );
})

export default Depart;