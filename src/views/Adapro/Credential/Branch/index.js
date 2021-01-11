import React,{useState, useEffect} from 'react';
import API from 'api';
import {makeStyles, Paper, useStyles} from '@material-ui/core'
import Table from './../../../../components/TableBranch'
import {useSelector, useDispatch} from 'react-redux'
import { Button} from 'reactstrap'
import { AlternateEmail } from '@material-ui/icons';
import Dialog from './../../../../components/popupAll'
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';  
import Tooltip from '@material-ui/core/Tooltip';
const useStyless = makeStyles(theme=>({
  table:{
    '& tbody tr:hover' : {
      backgroudnColor:'#fffbf3',
      cursor:'pointer',
    }
  },
}))  

const Branch = React.memo(() =>{
    const classes = useStyless();
    let token = localStorage.getItem('id_token');
    const [dataBranchAll, setDataBranchAll] = useState([]);
    const [open, setOpen] = useState(false);
    const [jumlahdata, setJumlahData] = useState(0);
    const [actionForm, setActionForm] = useState('');
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupBranch.isOpen);
    const rowperpageDepart = useSelector(state=>state.rowperpageBranch);
    const dispatch = useDispatch();
    const kirimisOpenDepart = React.useCallback((isOpen) => {
        return {
          type: "OPENBRANCH",
          payload: {
            isOpen: isOpen,
          }
        }
      },[])
      const kirimSelected = React.useCallback((jumlah, data) => {
        return {
          type: "SELECTEDUSER",
          payload: {
            selectedUser: jumlah,
            selectedId:data
          }
        }
      } ,[]) 
      useEffect(()=>{
        dispatch(kirimSelected(0,[]))
        
      }, [])

    const rowAdd = React.useCallback(()=>{
        dispatch(kirimisOpenDepart(true))
        setOpen(true);
        setActionForm("Add Branch")
    },[dataSelected])
    const rowEdit =   React.useCallback(()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            dispatch(kirimisOpenDepart(true))
            setOpen(true);
            setActionForm("Edit Branch")

        }
    },[dataSelected])
    const rowDelete =  React.useCallback(()=>{
        if(dataSelected.selectedUser==0){
            alert("no item selected")
        }else{
            let hasil  = "";
            var fetches = [];
            for(let i=0;i<dataSelected.selectedId.length;i++){
                let token = localStorage.getItem('id_token');
             
                fetches.push(API.post("/credential_service/delete_branch",{
                  key: token,
                  branch_id: dataSelected.selectedId[i]
                }).then(data => {
                hasil = hasil +"Branch ID "+dataSelected.selectedId[i]+" "+data.data.data+"\n";
                
               
              }).catch(err=>{
                  alert(err)
              }))
            }
            Promise.all(fetches).then(function() {
              alert(hasil);
            
              
            }).then(()=>{
            
              getBranchAll(rowperpageDepart.halaman,rowperpageDepart.jumlah);
            });
           
        }

    }, [dataSelected])
    const getBranchAll = React.useCallback((hal, rowperpage)=>{
        API.post("/credential_service/get_branch",{
            key: token,
            info_data:'all',
            per_page:rowperpage,
            page:hal
        }).then(data => {
            setDataBranchAll(data.data.data);
            setJumlahData(data.data.count_data);
          
          
            
          
        })
    },[setDataBranchAll,rowperpageDepart.halaman,rowperpageDepart.jumlah])
    useEffect(()=>{
        getBranchAll(rowperpageDepart.halaman,rowperpageDepart.jumlah);
        setOpen(popupDepart)
       
    },[popupDepart,rowperpageDepart.jumlah, rowperpageDepart.halaman])
    return(
    <div>
        <Tooltip title="Add Branch" aria-label="Add Branch">
         
          <Button  id="btnRowAdd" className="btn-pill btn btn-outline-dark btn-m" style={{fontSize:"20px"}}  onClick={rowAdd}><i className="fa fa-plus-square"></i></Button>
           
          
        </Tooltip>
        {dataSelected.selectedUser>0?  <Tooltip title="Delete Branch" aria-label="Delete Branch"><Button style={{fontSize:'20px', marginLeft:'5px'}}  id="btnRowDelete" className="btn-pill btn btn-outline-danger btn-m" onClick={rowDelete}><i className="fa fa-window-close"></i></Button></Tooltip>:''}
        {dataSelected.selectedUser==1?<Tooltip title="Edit Branch" aria-label="Edit Branch"><Button color="warning" id="btnTableEdit" className="btn-pill btn-m" style={{fontSize:'20px', marginLeft:'5px'}}  onClick={rowEdit}><i className="fa fa-edit"></i></Button></Tooltip> : null}

        
        <Table className={classes.table} jumlahdata={jumlahdata} data={dataBranchAll} groupName={""}></Table>
        <Dialog open={open} actionForm={actionForm}></Dialog>


    </div>    
    );
})

export default Branch;