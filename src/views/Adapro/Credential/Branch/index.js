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
import Filterdata from './../../filter';
import { saveAs } from 'file-saver';
import { 
  Card,
  CardBody,
  CardFooter,
  CardHeader,Label,Input,
  } from 'reactstrap';


import {Query, Builder, BasicConfig, Utils as QbUtils} from 'react-awesome-query-builder';
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
    const [schema, setSchema] = useState([]);
    const [actionForm, setActionForm] = useState('');
    const [filterOpen, setfilterOpen] = useState(false);
    const dataSelected = useSelector(state=>state.userSettingSelected);
    const popupDepart = useSelector(state=>state.popupBranch.isOpen);
    const rowperpageDepart = useSelector(state=>state.rowperpageBranch);
    const userAccess = useSelector(state=>state.userAcces);
    const [jumlahdata, setJumlahData] = useState(5);
    const dispatch = useDispatch();
    const MenuAccess = useSelector(state=>state.MenuAccess);
    const [Menu , setMenu] = useState({
      access_view:false,
      access_create:false,
      access_update:false,
      access_delete:false
    })
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
        for(const key of MenuAccess.menu){
          if(key.name=="branch"){
            setMenu({
              access_view:(key.access_view ==="true"),
              access_create:(key.access_create ==="true"),
              access_update:(key.access_update ==="true"),
              access_delete:(key.access_delete ==="true")
            })
          }
        }
      }, [])
      const tableDownload = () => { //download
        let token = localStorage.getItem('id_token');
        API.post('download_excel', { 
          responseType: 'arraybuffer' , 
       
            key:token,
            data:'branch'
          
          })
          .then((response) => {
            saveAs(new Blob([new Uint8Array(response.data.file_excel.data)],{type:"application/octet-stream"}), 'branch.xlsx');
          });
        }
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
    const renderAll = React.useCallback((data)=>{
      setDataBranchAll(data)
  }, [setDataBranchAll])
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
    const tableFilter  = React.useCallback(()=>{
      if(filterOpen==true){
        setfilterOpen(false)
        

      }else{
        setfilterOpen(true)
      }
    }, [filterOpen])
    const getBranchAll = React.useCallback((hal, rowperpage)=>{
        API.post("/get_branch",{
            key: token,
            info_data:'all',
            per_page:rowperpage,
            page:hal
        }).then(data => {
          setSchema(Object.keys(data.data.data[0]))
            setDataBranchAll(data.data.data);
            setJumlahData(data.data.count_data);
            
          
            
          
        })
    },[setDataBranchAll,rowperpageDepart.halaman,rowperpageDepart.jumlah])
    useEffect(()=>{
        getBranchAll(rowperpageDepart.halaman,rowperpageDepart.jumlah);
        setOpen(popupDepart)
      
    },[popupDepart,rowperpageDepart.jumlah, rowperpageDepart.halaman])
    return(
    <div style={{marginTop:'-22px'}}>
      { Menu.access_create==true?
        <Tooltip title="Add Branch" aria-label="Add Branch">
         
          <Button  id="btnRowAdd" className="btn-pill btn btn-outline-dark btn-m" style={{fontSize:"20px"}}  onClick={rowAdd}><i className="fa fa-plus-square"></i></Button>
           
          
        </Tooltip>
      
      :''}
        {dataSelected.selectedUser>0 &&  Menu.access_delete==true?  <Tooltip title="Delete Branch" aria-label="Delete Branch"><Button style={{fontSize:'20px', marginLeft:'5px'}}  id="btnRowDelete" className="btn-pill btn btn-outline-danger btn-m" onClick={rowDelete}><i className="fa fa-window-close"></i></Button></Tooltip>:''}
        {dataSelected.selectedUser==1 &&  Menu.access_update==true?<Tooltip title="Edit Branch" aria-label="Edit Branch"><Button color="warning" id="btnTableEdit" className="btn-pill btn-m" style={{fontSize:'20px', marginLeft:'5px'}}  onClick={rowEdit}><i className="fa fa-edit"></i></Button></Tooltip> : null}
        <Tooltip title="Filter User" aria-label="Filter User"><Button  id="btnFilter"  className="btn-pill btn-outline-light btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={tableFilter}><i className="fa fa-filter"></i></Button></Tooltip>
        <Tooltip title="Download Branch" aria-label="Download Branch"><Button  id="btnDownload"  className="btn-pill btn-outline-info btn-m" style={{fontSize:'20px', marginLeft:'5px'}} onClick={tableDownload}><i className="fa fa-cloud-download"></i></Button></Tooltip>

        <Card>
                            <CardHeader><strong><i className="fa fa-filter"></i>&nbsp;Source Filter</strong></CardHeader>
                            <CardBody bodystyle={{padding: "0"}}>
                                <Filterdata data={this.state.dataSet} onClick={renderAll} name={"branch"} schema={this.state.schema}  jumlahdata={this.state.jumlah} deptName={[...this.state.dept]}  roleName={[...this.state.role]} groupName={[...this.state.group]}></Filterdata>
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
        <Table className={classes.table} jumlahdata={jumlahdata} schema={[...schema]} data={dataBranchAll} groupName={""}></Table>
        <Dialog open={open} actionForm={actionForm}></Dialog>


    </div>    
    );
})

export default Branch;