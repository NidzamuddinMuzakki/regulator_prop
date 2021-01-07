import React from 'react';
import { withStyles, useStyle, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
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
import {connect} from 'react-redux';
import {useSelector,useDispatch} from 'react-redux';
const useStyles = makeStyles((theme) => ({
    root: {
    
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
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
    Date.prototype.toDateInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON().slice(0,10);
  });
  const selectedusersetting = useSelector(state =>state.userSettingSelected);
const [username, setUsername] = React.useState("");
const [password, setPassword] = React.useState("");
const [name, setName] = React.useState("");
const [userid, setUserId] = React.useState("");
const [group, setGroup] = React.useState(0);
const [nik, setNik] = React.useState("");
const [depart, setDepart] = React.useState(0);
const [role, setRole] = React.useState(0);
const [periode, setPeriode] = React.useState(0);
const [branch, setBranch] = React.useState(0);
const [expired, setExpired] = React.useState("");
const [status, setStatus] = React.useState("");
const [dataDepart, setDataDepart] = React.useState([]);
const [dataGroup, setDataGroup] = React.useState([]);
const [dataRole, setDataRole] = React.useState([]);
const [dataBranch, setDataBranch] = React.useState([]);
let actionForm = props.actionForm;
const getUserDetail = (id) => {  //on startup function
  let token = localStorage.getItem('id_token');
 
  API.post("/credential_service/get_user",{
    key: token,
    user_id:id
  }).then(data => {
      setUserId(data.data.data[0].user_id)
      setUsername(data.data.data[0].username)
      setPassword(data.data.data[0].password)
      setName(data.data.data[0].name)
      setNik(data.data.data[0].nik)
      setPeriode(data.data.data[0].periode_usage)
      setStatus(data.data.data[0].status_date)
      setExpired(data.data.data[0].expired_date)
      setBranch(data.data.data[0].branch_id)
      setRole(data.data.data[0].role_id)
      setDepart(data.data.data[0].dept_id)
      setGroup(data.data.data[0].group_id)
    // this.setState({
    //   dataSet: data.data.data
    // });
  
  })
}






const getUserDept = () => {  //on startup function
    let token = localStorage.getItem('id_token');
   
    API.post("/credential_service/get_department",{
      key: token,
      info_data:'all'
    }).then(data => {
    
        setDataDepart(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    })
  }

  const getUserGroup = () => {  //on startup function
    let token = localStorage.getItem('id_token');
   
    API.post("/credential_service/get_group",{
      key: token,
      info_data:'all'
    }).then(data => {
    
        setDataGroup(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    })
  }
  const getUserRole = () => {  //on startup function
    let token = localStorage.getItem('id_token');
   
    API.post("/credential_service/get_role",{
      key: token,
      info_data:'all'
    }).then(data => {
    
        setDataRole(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    })
  }
  const getUserBranch = () => {  //on startup function
    let token = localStorage.getItem('id_token');
   
    API.post("/credential_service/get_branch",{
      key: token,
      info_data:'all'
    }).then(data => {
    
        setDataBranch(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    })
  }


  const isOpen = useSelector(state =>state.popup.isOpen);
  const selected = useSelector(state =>state.userSettingSelected);


  console.log(selected.selectedUser)
  function getSelectedItem(databesar,datakecil){
    const item = databesar.find((opt)=>{
      if (opt.value == datakecil)
        return opt;
    })
    return item || {};
  }
  const [open, setOpen] = React.useState(isOpen);
  const dispatch = useDispatch();
  const kirimisOpen = (isOpen)=>{
    return{
      type:"CLOSE",
      payload:{
        isOpen: isOpen,
      }
    }
  }
  const convert = (name, value)=>({
      target:{
          name, value
      }
  })
  const handleSubmitUser =(e)=>{
    let token = localStorage.getItem('id_token');
   console.log(role)
   if(actionForm=="EDIT USER"){
    API.post("/credential_service/update_user",{
      key: token,
      user_id:userid,
      role_id:parseInt(role),
      dept_id:depart,
      group_id:group,
      branch_id:branch,
      nik:nik,
      username:username,
      name:name,
      password:password,
      periode_usage:periode,
      expired_date:expired,
      status_date:status,

    }).then(data => {
    
        // console.log(data.data)
        alert("berhasil Mengubah")
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    }).catch((err)=>{
        alert("Anda Bukan Admin")
    })
   }else{
    API.post("/credential_service/create_user",{
      key: token,
      user_id:userid,
      role_id:role,
      dept_id:depart,
      group_id:group,
      branch_id:branch,
      nik:nik,
      username:username,
      name:name,
      password:password,
      periode_usage:periode,
      expired_date:expired,
      status_date:status,

    }).then(data => {
    
        // console.log(data.data)
        alert("berhasil menambah")
      // this.setState({
      //   dataSet: data.data.data
      // });
    
    })
   }
  }
  const handleChange = (e)=>{
      let etarget = e.target.name;
      console.log(e.target.name)
      if(etarget=="username"){
        setUsername(e.target.value);
      }else if(etarget=="password")
      {
        setPassword(e.target.value);
      }else if(etarget=="nik")
      {
        setNik(e.target.value)
      }else if(etarget=="name"){
        setName(e.target.value)
      }else if(etarget=="depart"){
        setDepart(e.target.value)
      }else if(etarget=="userid"){
        setUserId(e.target.value)    
      }else if(etarget=="group"){
        setGroup(e.target.value)
      }else if(etarget=="role"){
        setRole(e.target.value)
      }else if(etarget=="branch")
      {
        console.log(e.target.value)
         setBranch(e.target.value)
      }
      else if(etarget=="periode"){
        console.log(e.target.name)
        setPeriode(e.target.value)
      }else if(etarget=="expired"){
        setExpired(e.target.value)
      }else if(etarget=="status"){
        setStatus(e.target.value)                       
      }
        
       
       
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(kirimisOpen(false))
  };
 
  useEffect(()=>{
      setOpen(isOpen)
      console.log(isOpen)

      getUserDept();
      getUserGroup();
      getUserRole();
      getUserBranch();
      if(actionForm=="EDIT USER"){
        let id = selectedusersetting.selectedId;
    
        getUserDetail(id);
      }
   
  },[isOpen])
 
  return (
    <div >
      
      <Dialog 
      fullWidth="true"
        maxWidth="md"  onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          ADD USER
        </DialogTitle>
        <DialogContent  className={classes.root}>
          <Grid container  spacing={3} >
           

            <Grid  xs={12} sm={6}  md={4} >
                <Grid style={{padding:"10px"}}>
                <h6 style={{marginLeft:"10px"}}>1. User</h6>
                <TextField
   style={{margin:"5px", width:"100%"}}
   label="User Id"
   onChange={handleChange}
   placeholder="User Id"
   variant="outlined"
   name="userid"
   value={userid}
   // error={touched && invalid}
   // helperText={touched && error}
   // {...input}
   // {...custom}
   />
                <TextField  style={{margin:"5px", width:"100%"}}
    label="Username"
    name="username"
    value={username}
    placeholder="Username"
    variant="outlined"
    onChange={handleChange}
    // error={touched && invalid}
    // helperText={touched && error}
    // {...input}
    // {...custom}
    />
   <TextField
   style={{margin:"5px", width:"100%"}}
   label="Password"
   value={password}
   onChange={handleChange}
   placeholder="Password"
   variant="outlined"
   name="password"
   // error={touched && invalid}
   // helperText={touched && error}
   // {...input}
   // {...custom}
   />
     <TextField
            style={{margin:"5px", width:"100%"}}
            name="name"
            label="Name"
            value={name}
            placeholder="name"
            variant="outlined"
            onChange={handleChange}
            // error={touched && invalid}
            // helperText={touched && error}
            // {...input}
            // {...custom}
            />
     <TextField
            style={{margin:"5px", width:"100%"}}
            name="nik"
            label="Nik"
            value={nik}
            onChange={handleChange}
            placeholder="nik"
            variant="outlined"
            // error={touched && invalid}
            // helperText={touched && error}
            // {...input}
            // {...custom}
            />
  <TextField
            style={{margin:"5px", width:"100%"}}
            name="periode"
            label="Periode Usage"
            type="number"
            value={periode}
            onChange={handleChange}
            placeholder="Periode Usage"
            variant="outlined"
            // error={touched && invalid}
            // helperText={touched && error}
            // {...input}
            // {...custom}
            />

                </Grid>
            
            </Grid>
            <Grid xs={12} sm={6} md={4} style={{width:"80%"}}  >
               <Grid style={{padding:"10px"}}>
<br></br>
                <Autocomplete
  id="depart"
  name="depart"
  options={dataDepart}
  value={dataDepart.find(v => v.dept_id == depart) || {}}
  getOptionLabel={(option) => option.dept_name}
  onChange={(e, value)=>handleChange(convert("depart",value?value.dept_id:''))}
  renderInput={(params) => <TextField name="depart" style={{margin:"5px",}} {...params} label="Departement" variant="outlined" />}
/>

<Autocomplete

id="group"
name="group"
options={dataGroup}
value={dataGroup.find(v => v.group_id == group) || {}}
getOptionLabel={(option) => option.group_name}
onChange={(e, value)=>handleChange(convert("group", value?value.group_id:''))}
renderInput={(params) => <TextField style={{margin:"5px"}} {...params} label="Group" variant="outlined" />}
/>
<Autocomplete

id="role"
name="role"
options={dataRole}
value={dataRole.find(v => v.role_id == role) || {}}
getOptionLabel={(option) => option.role_name}
onChange={(e, value)=>handleChange(convert("role", value?value.role_id:''))}
renderInput={(params) => <TextField style={{margin:"5px"}} {...params} label="Role" variant="outlined" />}
/>
<TextField
        id="date"
        label="Date Expired"
        type="date"
        style={{margin:"5px", width:"100%"}}
        variant="outlined"
        value={expired}
        name="expired"
        
        onChange={handleChange}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
          
        }}
        />
      <TextField
        id="date"
        style={{margin:"5px", width:"100%"}}
        variant="outlined"
        label="Date Status"
        type="date"
        
        value={status}
        name="status"
        
        onChange={handleChange}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
          
        }}
        />
  
         
                         
                </Grid>
          
              </Grid>
            <Grid xs={12} sm={6} md={4} >
              <h6 style={{marginLeft:"10px"}}>2. Branch</h6>
            <Autocomplete

id="role"
name="role"

options={dataBranch}

getOptionLabel={(option) => option.branch_name}
onChange={(e, value)=>handleChange(convert("branch", value?value.branch_id:''))}
renderInput={(params) => <TextField   style={{margin:"10px"}} {...params} label="Branch" variant="outlined" />}
value={dataBranch.find(v => v.branch_id == branch) || {}}
/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSubmitUser} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
