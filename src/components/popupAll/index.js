import React from 'react';
import { withStyles, useStyle, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import API from './../../api/api';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';
import set from 'core-js/es6/set';
import DatePicker from './../datepicker/index';
import { connect } from 'react-redux';
import PersonIcon from '@material-ui/icons/Person';
import { useSelector, useDispatch } from 'react-redux';
import { popupDepart } from '../../reducers/PopAll';
const useStyles = makeStyles((theme) => ({
  root: {
   
  },
  back:{
    background:"#ebeff1"
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  popup:{
    "&:hover":{
      boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
    }
  }
}));
const styles = (theme) => ({
  root: {
    margin: 0,

  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
  const classes = useStyles();
  
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState([]);
//   console.log(open)
  Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  });
  

  const selectedusersetting = useSelector(state => state.userSettingSelected);
  
  // const [username, setUsername] = React.useState("");
  // const [password, setPassword] = React.useState("");
  // const [name, setName] = React.useState("");
  // const [userid, setUserId] = React.useState("");
  const [dataGroup, setDataGroup] = React.useState([]);
  
  // const [nik, setNik] = React.useState("");
  // const [depart, setDepart] = React.useState(0);
  // const [role, setRole] = React.useState(0);
  // const [periode, setPeriode] = React.useState(0);
  // const [branch, setBranch] = React.useState(0);
  // const [expired, setExpired] = React.useState("");
  // const [status, setStatus] = React.useState("");
  const [dataChange, setDataChange] = React.useState({
   dept_name:'',
   dept_id:'',
   role_name:'',
   role_id:'',
   group_name:'',
   group_id:'',
   branch_id:'',
   branch_name:''
  })
  

 
  let actionForm = props.actionForm;
 
 
  const isOpenDepart = useSelector(state=>state.popupDepart.isOpen)
  const isOpenGroup = useSelector(state=>state.popupGroup.isOpen)
  
  const selected = useSelector(state => state.userSettingSelected);
  
  const getDepartDetail = React.useCallback((id) => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("/credential_service/get_department", {
      key: token,
      dept_id: id,
      info_data: "detail"
    }).then(data => {
      let uaja = data.data.data;
      
      setDataChange({
            dept_name:data.data.data.dept_name,
            dept_id:data.data.data.dept_id,
            group_id:data.data.data.group_id
        }) 
    })
    
    },[setDataChange]  ) 
    const getBranchDetail = React.useCallback((id) => {  //on startup function
        let token = localStorage.getItem('id_token');
    
        API.post("/credential_service/get_branch", {
          key: token,
          branch_id: id,
          info_data: "detail"
        }).then(data => {
          let uaja = data.data.data;
          
          setDataChange({
                branch_name:data.data.data.branch_name,
                branch_id:data.data.data.branch_id,
                
            }) 
        })
        
    },[setDataChange])

const getGroupDetail = React.useCallback((id) => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("/credential_service/get_group", {
      key: token,
      group_id: id,
      info_data: "detail"
    }).then(data => {
      let uaja = data.data.data;
      
      setDataChange({
            group_name:data.data.data.group_name,
            group_id:data.data.data.group_id
        }) 
    })
    
},[setDataChange])
const getRoleDetail = React.useCallback((id) => {  //on startup function
  let token = localStorage.getItem('id_token');

  API.post("/credential_service/get_role", {
    key: token,
    role_id: id,
    info_role: "detail"
  }).then(data => {
    let uaja = data.data.data;
    
    setDataChange({
          role_name:data.data.data.role_name,
          role_id:data.data.data.role_id
      }) 
  })
  
},[setDataChange])




    
      // setUserId(data.data.data.user_id)
      // setUsername(data.data.data.username)
      // setPassword(data.data.data.password)
      // setName(data.data.data.name)
      // setNik(data.data.data.nik)
      // setPeriode(data.data.data.periode_usage)
      // setStatus(data.data.data.status_date)
      // setExpired(data.data.data.expired_date)
      // setBranch(data.data.data.branch_id)
      // setRole(data.data.data.role_id)
      // setDepart(data.data.data.dept_id)
      // setGroup(data.data.data.group_id)
      // this.setState({
      //   dataSet: data.data.data
      // });


const getGroup = React.useCallback(() => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("/credential_service/get_group", {
      key: token,
      info_data: "all"
    }).then(data => {
      let uaja = data.data.data;
      setDataGroup(data.data.data)
    })
},[setDataGroup])
  const kirimuserselected = (jumlah, data) => {
    return {
      type: "SELECTEDUSER",
      payload: {
        selectedUser: jumlah,
        selectedId: data
      }
    }
  }





  

 
  






  
  const dispatch = useDispatch();
  const kirimisOpen = (isOpen, type) => {
    return {
      type: type,
      payload: {
        isOpen: isOpen,
      }
    }
  }
  const convert = (name, value) => ({
    target: {
      name, value
    }
  })
  const handleSubmitUser = (e) => {

   
    let token = localStorage.getItem('id_token');
    // console.log(role);
    // dispatch(kirimuserselected(0, []))
    if (actionForm == "Edit Department") {
      API.post("/credential_service/update_department", {
        key: token,
        dept_id:dataChange.dept_id,
        dept_name:dataChange.dept_name,
        group_id:dataChange.group_id

      }).then(data => {

        // console.log(data.data)
        alert("berhasil Mengubah")
        setOpen(false);
        dispatch(kirimisOpen(false,"CLOSEDEPART"))
        resetForm();
        // this.setState({
        //   dataSet: data.data.data
        // });

      }).catch((err) => {
        alert("Anda Bukan Admin")
        setOpen(false);
        dispatch(kirimisOpen(false,"CLOSEDEPART"))
        resetForm();
      })
    } else  if (actionForm == "Add Department") {
      API.post("/credential_service/create_department", {
        key: token,
        
        dept_id:dataChange.dept_id,
        dept_name:dataChange.dept_name,
        group_id:dataChange.group_id

      }).then(data => {

        // console.log(data.data)
        alert("berhasil menambah")
        setOpen(false);
        dispatch(kirimisOpen(false,"CLOSEDEPART"))
        resetForm();
        // this.setState({
        //   dataSet: data.data.data
        // });

      })
    }
    else  if (actionForm == "Add Branch") {
        API.post("/credential_service/create_branch", {
          key: token,
          
          branch_id:dataChange.branch_id,
          branch_name:dataChange.branch_name,
         
  
        }).then(data => {
  
          // console.log(data.data)
          alert("berhasil menambah")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEBRANCH"))
          resetForm();
          // this.setState({
          //   dataSet: data.data.data
          // });
  
        })
      }
    else  if (actionForm == "Add Group") {
        API.post("/credential_service/create_group", {
          key: token,
          
         
          group_name:dataChange.group_name,
          group_id:dataChange.group_id
  
        }).then(data => {
  
          // console.log(data.data)
          alert("berhasil menambah")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEGROUP"))
          resetForm();
          // this.setState({
          //   dataSet: data.data.data
          // });
  
        })
      }

     else if (actionForm == "Edit Group") {
        API.post("/credential_service/update_group", {
          key: token,
        
          group_name:dataChange.group_name,
          group_id:dataChange.group_id
  
        }).then(data => {
  
          // console.log(data.data)
          alert("berhasil Mengubah")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEGROUP"))
          resetForm();
          // this.setState({
          //   dataSet: data.data.data
          // });
  
        }).catch((err) => {
          alert("Anda Bukan Admin")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEGROUP"))
          resetForm();
        })
      }
      else if (actionForm == "Edit Branch") {
        API.post("/credential_service/update_branch", {
          key: token,
        
          branch_name:dataChange.branch_name,
          branch_id:dataChange.branch_id
  
        }).then(data => {
  
          // console.log(data.data)
          alert("berhasil Mengubah")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEBRANCH"))
          resetForm();
          // this.setState({
          //   dataSet: data.data.data
          // });
  
        }).catch((err) => {
          alert("Anda Bukan Admin")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEBRANCH"))
          resetForm();
        })
      }

  }
  const handleChange = React.useCallback((e) => {

      setDataChange({
        ...dataChange,
        [e.target.name]:e.target.value 
      })
    // let etarget = e.target.name;
    // console.log(e.target.name)
    // if (etarget == "username") {
    //   setDataChange({
    //     username:e.target.value
    //   })
    // }
    // else if (etarget == "password") {
    //     setDataChange({
    //       password:e.target.value

    //     } )
    // }
    // }  else if (etarget == "nik") {
    //   setNik(e.target.value)
    // } else if (etarget == "name") {
    //   setName(e.target.value)
    // } else if (etarget == "depart") {
    //   setDepart(e.target.value)
    // } else if (etarget == "userid") {
    //   setUserId(e.target.value)
    // } else if (etarget == "group") {
    //   setGroup(e.target.value)
    // } else if (etarget == "role") {
    //   setRole(e.target.value)
    // } else if (etarget == "branch") {
    //   console.log(e.target.value)
    //   setBranch(e.target.value)
    // }
    // else if (etarget == "periode") {
    //   console.log(e.target.name)
    //   setPeriode(e.target.value)
    // } else if (etarget == "expired") {
    //   setExpired(e.target.value)
    // } else if (etarget == "status") {
    //   setStatus(e.target.value)
    // }


 
  }, [dataChange])
  const handleClickOpen = () => {
    setOpen(true);
  };
  const resetForm = React.useCallback(() => {
    setDataChange({
     
        dept_name:'',
        dept_id:'',
        role_name:'',
        role_id:'',
        group_name:'',
        group_id:'',
        branch_id:'',
        branch_name:''
   
    })
    dispatch(kirimuserselected(0,[]))
  },[setDataChange]);
 
  const Form  = React.memo((props)=>{
      return (
          <div>
                 

          </div>
      )
  })
  const handleClose = React.useCallback(() => {
    
    if(props.actionForm=="Add Department"||props.actionForm=="Edit Department"){
        dispatch(kirimisOpen(false,"CLOSEDEPART"))
       

    }else if(props.actionForm=="Add Group" || props.actionForm=="Edit Group"){
        dispatch(kirimisOpen(false,"CLOSEGROUP"))
        
    }
    else if(props.actionForm=="Add Branch" || props.actionForm=="Edit Branch"){
        dispatch(kirimisOpen(false,"CLOSEBRANCH"))
        
    }
    else if(props.actionForm=="Add Role" || props.actionForm=="Edit Role"){
      dispatch(kirimisOpen(false,"CLOSEROLE"))
      
  }
    dispatch(kirimuserselected(0,[]))
    setOpen(false);
    resetForm();

  },[open]);

  useEffect(() => {
    setOpen(props.open)
   
   
    if(actionForm=="Edit Department" || actionForm=="Add Department"){
        getGroup();
        if (actionForm == "Add Department") {
        
            resetForm();
            // console.log(open)
        //   let id = selectedusersetting.selectedId[0];
        //   getUserDetail(id);
        } else if(actionForm == "Edit Department") {
            resetForm();
        
          if(selected.selectedUser==1){
              getDepartDetail(selected.selectedId[0]);
          }
        }
    }else if(actionForm=="Edit Group" || actionForm=="Add Group"){
        if (actionForm == "Add Group") {
        
            resetForm();
            // console.log(open)
        //   let id = selectedusersetting.selectedId[0];
        //   getUserDetail(id);
        } else if(actionForm == "Edit Group") {
            resetForm();
        
          if(selected.selectedUser==1){
              getGroupDetail(selected.selectedId[0]);
          }
    }
    
}else if(actionForm=="Edit Branch" || actionForm=="Add Branch"){
    if (actionForm == "Add Branch") {
    
        resetForm();
        // console.log(open)
    //   let id = selectedusersetting.selectedId[0];
    //   getUserDetail(id);
    } else if(actionForm == "Edit Branch") {
        resetForm();
    
      if(selected.selectedUser==1){
          getBranchDetail(selected.selectedId[0]);
      }
}
}
else if(actionForm=="Edit Role" || actionForm=="Add Role"){
  if (actionForm == "Add Role") {
  
      resetForm();
      // console.log(open)
  //   let id = selectedusersetting.selectedId[0];
  //   getUserDetail(id);
  } else if(actionForm == "Edit Role") {
      resetForm();
  
    if(selected.selectedUser==1){
        getRoleDetail(selected.selectedId[0]);
    }
}

}

    

  }, [props.open])
  const value = "ACCU-SEAL 35-532 Bag Sealer";
  return (
    <div >

      <Dialog
     
        fullWidth={true}
        maxWidth="sm" style={{ }}  onClose={handleClose}  aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle style={{ }} id="customized-dialog-title" onClose={handleClose}>
          <div style={{ display: "flex", }}>
            <Paper style={{ width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}><PersonIcon ></PersonIcon></Paper>
            <div style={{width: "300px", height: "50px",  marginLeft:"10px",alignItems:"center",justifyContent:"center" }}>
                
                  <span color="primary" style={{display: "flex",lineHeight: "50px", fontFamily:"revert", color:"primary",}}  >{props.actionForm}</span>
                 
            </div> 

          </div>

        </DialogTitle>

        <DialogContent className={classes.root}  >
          <Grid container spacing={1} style={{display:'flex', justifyContent:'center', alignItems:'center' ,}} >


            <Grid item xs={8}   style={{width:"100%",boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", padding:'10px'}} >
            
               
             {actionForm=="Edit Department"||actionForm=="Add Department"?
                <div>
                 <TextField
                 style={{ width:"100%"}}
                 label={"Departement Id"}
                 onChange={handleChange}
                 placeholder="User Id"
                 variant="outlined"
                 name={"dept_id"}
                 type="number"
                 value={dataChange.dept_id}
                 
                 // error={touched && invalid}
                 // helperText={touched && error}
                 // {...input}
                 // {...custom}
                 />                             
                  <TextField
                 style={{ width:"100%", marginTop:"10px"}}
                 label={"Department Name"} 
                 onChange={handleChange}
                 variant="outlined"
                 name={"dept_name"}
                 value={dataChange.dept_name} ></TextField>
                 <Autocomplete
                 
                
                  options={dataGroup}
                  value={dataChange.group_id?dataGroup.find(v => v.group_id == dataChange.group_id):''}
                  // getOptionSelected ={(option, value) => option === value?option:''}
                  getOptionLabel={(option) => option.group_name?option.group_name:""}
                  onChange={(e, value) => handleChange(convert("group_id", value ? value.group_id : ''))}
                  renderInput={(params) => <TextField name="depart" style={{ marginTop: "10px", }} {...params} label="Group" variant="outlined" />}
                />
                 </div>
             :actionForm=="Edit Group"||actionForm=="Add Group"?
             <div>
                   <TextField
                 style={{ width:"100%"}}
                 label={"Group ID"}
                 onChange={handleChange}
                 variant="outlined"
                 name={"group_id"}
                 type="number"
                 value={dataChange.group_id}
                 
                 // error={touched && invalid}
                 // helperText={touched && error}
                 // {...input}
                 // {...custom}
                 />                             
                  <TextField
                 style={{ width:"100%", marginTop:"10px"}}
                 label={"Group Name"} 
                 onChange={handleChange}
                 variant="outlined"
                 name={"group_name"}
                 value={dataChange.group_name} ></TextField>
             </div>
             
             :actionForm=="Edit Branch"||actionForm=="Add Branch"?
             <div>
             <TextField
           style={{ width:"100%"}}
           label={"Branch ID"}
           onChange={handleChange}
           variant="outlined"
           name={"branch_id"}
           type="number"
           value={dataChange.branch_id}
           
           // error={touched && invalid}
           // helperText={touched && error}
           // {...input}
           // {...custom}
           />                             
            <TextField
           style={{ width:"100%", marginTop:"10px"}}
           label={"Branch Name"} 
           onChange={handleChange}
           variant="outlined"
           name={"branch_name"}
           value={dataChange.branch_name} ></TextField>
       </div> :actionForm=="Edit Role"||actionForm=="Add Role"?
         <div>
         <TextField
       style={{ width:"100%"}}
       label={"Role ID"}
       onChange={handleChange}
       variant="outlined"
       name={"role_id"}
       type="number"
       value={dataChange.role_id}
       
       // error={touched && invalid}
       // helperText={touched && error}
       // {...input}
       // {...custom}
       />                             
        <TextField
       style={{ width:"100%", marginTop:"10px"}}
       label={"Role Name"} 
       onChange={handleChange}
       variant="outlined"
       name={"role_name"}
       value={dataChange.role_name} ></TextField>
   </div> 
       
       :''}
              </Grid>

            
            
          </Grid>
        </DialogContent>
        <DialogActions style={{}}>
          <Button className={classes.popup} autoFocus onClick={handleSubmitUser} >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
