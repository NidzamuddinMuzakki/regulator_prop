import React,{useState, useEffect} from 'react';
import API from 'api';
import {Paper} from '@material-ui/core'
import Table from './../../../../components/TableMenu'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../../components/popupAll'
   

const Depart = React.memo(() =>{
    let token = localStorage.getItem('id_token');
    const [dataMenuAll, setDataMenuAll] = useState([]);
    const [open, setOpen] = useState(false);
    const [actionForm, setActionForm] = useState('');
    const [jumlahdata, setJumlahData] = useState(0);
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupMenu.isOpen);
    const rowperpageGroup = useSelector(state=>state.rowperpageMenu);
    const dispatch = useDispatch();
    const kirimisOpenDepart = (isOpen) => {
        return {
          type: "OPENMENU",
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
        setActionForm("Add Menu")
    },[dataSelected])
    const rowEdit = React.useCallback(()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            dispatch(kirimisOpenDepart(true))
            setOpen(true);
            setActionForm("Edit Menu")

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
             
                fetches.push(API.post("/credential_service/delete_menu",{
                  key: token,
                  menu_id: dataSelected.selectedId[i]
                }).then(data => {
                hasil = hasil +"Menu ID "+dataSelected.selectedId[i]+" "+data.data.data+"\n";
             
               
              }).catch(err=>{
                  alert(err)
              })
                )}

            Promise.all(fetches).then(()=>{
                alert(hasil);
                getMenuAll();
                dispatch(kirimSelected(0,[]));
            })    
        }

    },[dataSelected])
    const getMenuAll = React.useCallback((jumlah, halaman)=>{
        API.post("/credential_service/get_menu",{
            key: token,
            info_data:'all',
            per_page:jumlah,
            page:halaman
        }).then(data => {
            setDataMenuAll(data.data.data);
            setJumlahData(data.data.count_data);
           
           
          
            
          
        })
    },[setDataMenuAll])
    useEffect(()=>{
        getMenuAll(rowperpageGroup.jumlah, rowperpageGroup.halaman);
        setOpen(popupDepart)
       
    },[popupDepart,rowperpageGroup.jumlah, rowperpageGroup.halaman])
    return(
    <div>
        <Button  id="btnRowAdd" className="btn-pill btn-outline-dark btn-m" onClick={rowAdd}>&nbsp;&nbsp;<i className="fa fa-plus-square"></i>&nbsp;<span>Add&nbsp;&nbsp;</span></Button>
        {dataSelected.selectedUser>0?<Button  id="btnRowDelete" className="btn-pill btn-outline-danger btn-m" onClick={rowDelete}><i className="fa fa-window-close"></i>&nbsp;<span>Delete</span></Button>:''}
        {dataSelected.selectedUser==1?<Button color="warning" id="btnTableEdit" className="btn-pill btn-m" onClick={rowEdit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-edit"></i>&nbsp;<span>Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Button> : null}

        
        <Table data={dataMenuAll} jumlahdata={jumlahdata} groupName={""}></Table>
        <Dialog open={open} actionForm={actionForm}></Dialog>


    </div>    
    );
})

export default Depart;