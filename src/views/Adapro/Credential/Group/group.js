import React,{useState, useEffect} from 'react';
import API from 'api';
import {Paper} from '@material-ui/core'
import Table from './../../../../components/TableGroup'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../../components/popupAll'
import Tooltip from '@material-ui/core/Tooltip';     

const Depart = React.memo(() =>{
    let token = localStorage.getItem('id_token');
    const [dataGroupAll, setDataGroupAll] = useState([]);
    const [open, setOpen] = useState(false);
    const [actionForm, setActionForm] = useState('');
    const [jumlahdata, setJumlahData] = useState(0);
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupGroup.isOpen);
    const rowperpageGroup = useSelector(state=>state.rowperpageGroup);
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
    const rowAdd =  React.useCallback(()=>{
        dispatch(kirimisOpenDepart(true))
        setOpen(true);
        setActionForm("Add Group")
    },[dataSelected])
    const rowEdit = React.useCallback(()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            dispatch(kirimisOpenDepart(true))
            setOpen(true);
            setActionForm("Edit Group")

        }
    },[dataSelected])
    const rowDelete = React.useCallback(()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            let hasil = "";
            var fetches = [];
            for(let i=0;i<dataSelected.selectedId.length;i++){
                let token = localStorage.getItem('id_token');
             
                fetches.push(API.post("/credential_service/delete_group",{
                  key: token,
                  group_id: dataSelected.selectedId[i]
                }).then(data => {
                hasil = hasil +"Group ID "+dataSelected.selectedId[i]+" "+data.data.data+"\n";
                
               
              }).catch(err=>{
                  alert(err)
              }))
            }
            Promise.all(fetches).then(function(){
              alert(hasil)
            }).then(()=>{
              getGroupAll(rowperpageGroup.jumlah, rowperpageGroup.halaman);
            })
        }

    },[dataSelected])
    const getGroupAll = React.useCallback((jumlah, halaman)=>{
        API.post("/credential_service/get_group",{
            key: token,
            info_data:'all',
            per_page:jumlah,
            page:halaman
        }).then(data => {
            setDataGroupAll(data.data.data);
            setJumlahData(data.data.count_data);
           
           
          
            
          
        })
    },[setDataGroupAll])
    useEffect(()=>{
      getGroupAll(rowperpageGroup.jumlah, rowperpageGroup.halaman);
        setOpen(popupDepart)
       
    },[popupDepart,rowperpageGroup.jumlah, rowperpageGroup.halaman])
  
    return(
    <div>
        {/* <Button color="dark" id="btnRowAdd" className="btn-pill" onClick={rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button>
        {dataSelected.selectedUser>0?<Button color="danger" id="btnRowDelete" className="btn-pill" onClick={rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button>:''}
        {dataSelected.selectedUser==1?<Button color="warning" id="btnTableEdit" className="btn-pill" onClick={rowEdit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-edit"></i>&nbsp;<span>Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null} */}
<Tooltip title="Add Group" aria-label="Add Group">
         
         <Button id="btnRowAdd" className="btn-pill btn-outline-dark btn-m" style={{fontSize:'20px'}} onClick={rowAdd}><i className="fa fa-plus-square"></i></Button>
          
         
       </Tooltip>
       {dataSelected.selectedUser>0?  <Tooltip title="Delete Group" aria-label="Delete Group"><Button style={{fontSize:'20px', marginLeft:'5px'}} id="btnRowDelete" className="btn-pill btn-outline-danger btn-m" onClick={rowDelete}><i className="fa fa-window-close"></i></Button></Tooltip>:''}
       {dataSelected.selectedUser==1?<Tooltip title="Edit Group" aria-label="Edit Group"><Button color="warning" id="btnTableEdit" className="btn-pill btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={rowEdit}><i className="fa fa-edit"></i></Button></Tooltip> : null}
        
        
        <Table data={dataGroupAll} jumlahdata={jumlahdata} groupName={""}></Table>
        <Dialog open={open} actionForm={actionForm}></Dialog>


    </div>    
    );
})

export default Depart;