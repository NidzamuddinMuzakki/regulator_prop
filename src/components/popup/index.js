import React from 'react';
import { withStyles, useStyle, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import API from './../../api/api';
import Checkbox from '@material-ui/core/Checkbox';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';

import PersonIcon from '@material-ui/icons/Person';
import { useSelector, useDispatch } from 'react-redux';

import Switch from '@material-ui/core/Switch';
import { InputLabel } from '@material-ui/core';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
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
  '& input:valid + fieldset': {
    borderColor: 'green',
    borderWidth: 2,
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
  Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  });
  const selectedusersetting = useSelector(state => state.userSettingSelected);
  const [error, setError ]= React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error1, setError1 ]= React.useState(false);
  const [message1, setMessage1] = React.useState('');
  // const [username, setUsername] = React.useState("");
  // const [password, setPassword] = React.useState("");
  // const [name, setName] = React.useState("");
  // const [userid, setUserId] = React.useState("");
  // const [group, setGroup] = React.useState(0);
  // const [nik, setNik] = React.useState("");
  // const [depart, setDepart] = React.useState(0);
  // const [role, setRole] = React.useState(0);
  // const [periode, setPeriode] = React.useState(0);
  // const [branch, setBranch] = React.useState(0);
  // const [expired, setExpired] = React.useState("");
  // const [status, setStatus] = React.useState("");
  const [dataChange, setDataChange] = React.useState({
    username:"",
    password:"",
    name:"",
    user_id:"",
    group_id:"",
    nik:"",
    dept_id:"",
    role_id:"",
    periode_usage:"",
    branch_id:"",
    view:true,
    create:true,
    delete:true,
    update:true,
    changePass:'',
    confirmPass:'',
    expired_date:new Date().toDateInputValue(),
    status_date:new Date().toDateInputValue()
  })


  const [dataDepart, setDataDepart] = React.useState([]);
  const [dataGroup, setDataGroup] = React.useState([]);
  const [dataRole, setDataRole] = React.useState([]);
  const [dataBranch, setDataBranch] = React.useState([]);
  let actionForm = props.actionForm;

  const isOpen = useSelector(state => state.popup.isOpen);
  const selected = useSelector(state => state.userSettingSelected);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword1, setShowPassword1] = React.useState(false);
const handleClickShowPassword = () => setShowPassword(!showPassword);
const handleMouseDownPassword = () => setShowPassword(!showPassword);
const handleClickShowPassword1 = () => setShowPassword1(!showPassword1);
const handleMouseDownPassword1= () => setShowPassword1(!showPassword1);
  const getUserDetail = (id) => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("get_user", {
      key: token,
      row_id: id,
      info_data: "detail"
    }).then(data => {
      let uaja = data.data.data;
      
      setDataChange({
        username:uaja.Username,
        password:uaja.Password,
        name:uaja.Nama,
        user_id:uaja.user_id,
        group_id:uaja.Group,
        nik:uaja.NIK,
        dept_id:uaja["Department Id"],
        role_id:uaja.Role,
        periode_usage:uaja["Periode Usage"],
        branch_id:uaja.branch_id,
        view:(uaja["Access View"] === 'true'),
        create:(uaja["Access Create"] === 'true'),
        update:(uaja["Access Update"] === 'true'),
        delete:(uaja["Access Delete"] === 'true'),
       
  
        expired_date:uaja.expired_date,
        status_date:uaja.status_date
      }) 
    })
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

    
  }
  const kirimuserselected = (jumlah, data) => {
    return {
      type: "SELECTEDUSER",
      payload: {
        selectedUser: jumlah,
        selectedId: data
      }
    }
  }





  const getUserDept = React.useCallback(() => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("get_department", {
      key: token,
      info_data: 'all'
    }).then(data => {

      setDataDepart(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });

    })
  },[])

  const getUserGroup = React.useCallback(() => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("get_group", {
      key: token,
      info_data: 'all'
    }).then(data => {

      setDataGroup(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });

    })
  }, [])
  const getUserRole =  React.useCallback(() => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("get_role", {
      key: token,
      info_data: 'all'
    }).then(data => {

      setDataRole(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });

    })
  })
  const getUserBranch = React.useCallback(() => {  //on startup function
  //   let token = localStorage.getItem('id_token');

  //   API.post("get_branch", {
  //     key: token,
  //     info_data: 'all'
  //   }).then(data => {

  //     setDataBranch(data.data.data)
  //     // this.setState({
  //     //   dataSet: data.data.data
  //     // });

  //   })
   }, [])





  
  function getSelectedItem(databesar, datakecil) {
    const item = databesar.find((opt) => {
      if (opt.value == datakecil)
        return opt;
    })
    return item || {};
  }
  const [open, setOpen] = React.useState(isOpen);
  const dispatch = useDispatch();
  const kirimisOpen = (isOpen) => {
    return {
      type: "CLOSE",
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
    console.log(dataChange);
    // console.log(role);
    
    if (actionForm == "EDIT USER") {
      let id = selectedusersetting.selectedId[0];
      API.post("update_user", {
        key: token,
        row_id:id,
        role_id: dataChange.role_id,
        dept_id: dataChange.dept_id,
        group_id: dataChange.group_id,
        branch_id: dataChange.branch_id,
        nik: dataChange.nik,
        username: dataChange.username,
        name: dataChange.name,
        password: dataChange.password,
        periode_usage: dataChange.periode_usage,
        expired_date: dataChange.expired_date,
        status_date: dataChange.status_date,
        user_report:'',
        black_reason:'',
        access_create:dataChange.create.toString(),
        access_view:dataChange.view.toString(),
        access_update:dataChange.update.toString(),
        access_delete:dataChange.delete.toString(),
      }).then(data => {

        // console.log(data.data)
        alert("berhasil Mengubah")
        setOpen(false);
        dispatch(kirimisOpen(false))
        resetForm();
        dispatch(kirimuserselected(0, []))
        // this.setState({
        //   dataSet: data.data.data
        // });

      }).catch((err) => {
        alert("Anda Bukan Admin")
        setOpen(false);
        dispatch(kirimisOpen(false))
        resetForm();
        dispatch(kirimuserselected(0, []))
      })
    }else if(actionForm=="CHANGE PASS") {
      let id = selectedusersetting.selectedId[0];
      API.post("change_password", {
        key: token,
        row_id: id,
        password:dataChange.changePass
     
       
      }).then(data => {

        // console.log(data.data)
        console.log(data)
      
        alert("berhasil Change Password")
        setOpen(false);
        dispatch(kirimisOpen(false))
        resetForm();
        dispatch(kirimuserselected(0, []))
        // this.setState({
        //   dataSet: data.data.data
        // });

      }).catch(error=>{
        alert(error)
        setOpen(false);
        dispatch(kirimisOpen(false))
        resetForm();
        dispatch(kirimuserselected(0, []))
      })
    
    }
    else if (actionForm == "ADD USER"){
      API.post("create_user", {
        key: token,
        
        user_id: dataChange.user_id,
        role_id: dataChange.role_id,
        dept_id: dataChange.dept_id,
        group_id:dataChange.group_id,
        branch_id:dataChange.branch_id,
        nik: dataChange.nik,
        username: dataChange.username,
        name: dataChange.name,
        password: dataChange.password,
        periode_usage: dataChange.periode_usage,
        expired_date: dataChange.expired_date,
        status_date: dataChange.status_date,
        access_create:dataChange.create,
        access_view:dataChange.view,
        access_update:dataChange.update,
        access_delete:dataChange.delete,
        user_report:'',
        black_reason:'',
      }).then(data => {

        // console.log(data.data)
        console.log(data)
      
        alert("berhasil menambah")
        setOpen(false);
        dispatch(kirimisOpen(false))
        resetForm();
        dispatch(kirimuserselected(0, []))
        // this.setState({
        //   dataSet: data.data.data
        // });

      })
    }
  }
  const handleChange = React.useCallback((e) => {

      setDataChange({
        ...dataChange,
        [e.target.name]:e.target.value 
      })

      if(e.target.name=="confirmPass"){
        if(e.target.value!=dataChange.changePass){
          setError(true);
          
        }else{
          setError(false);
          setMessage("Perfect !!");
        }
      }
      if(e.target.name=="changePass"){
        if(e.target.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)){
          setError1(false);
          setMessage1("Perfect!")
        }else{
          setError1(true);
          setMessage1("minimal 8 Characters, contain at least one numeric, one uppercase and one lowercase letter");
        }
      }
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



  },[dataChange])
  const handleClickOpen = () => {
    setOpen(true);
  };
  const resetForm = () => {
    setDataChange({
      username:"",
    password:"",
    name:"",
    user_id:"",
    group_id:"",
    nik:"",
    dept_id:"",
    role_id:"",
    periode_usage:"",
    branch_id:"",
    view:true,
    create:true,
    delete:true,
    update:true,
    changePass:'',
    confirmPass:'',
    expired_date:new Date().toDateInputValue(),
    status_date:new Date().toDateInputValue()
    })
    setError(false);
    setMessage('');
  }
  const handleClose = () => {
    setOpen(false);
    dispatch(kirimisOpen(false))
    setError(false);
    setMessage('');
    setError1(false);
    setMessage1('');
    dispatch(kirimuserselected(0,[]))
    resetForm();

  };
  useEffect(()=>{
    console.log(dataChange)
  },[dataChange])
  useEffect(() => {
    setOpen(isOpen)
    

    getUserDept();
    getUserGroup();
    getUserRole();
    getUserBranch();
  
    if (actionForm == "EDIT USER") {
      let id = selectedusersetting.selectedId[0];
      getUserDetail(id);
    } else {
      resetForm();
    }
    // console.log(dataChange)
    // dataChange.role_id.map((cat) => dataRole.role_id == cat.role_id )

  }, [isOpen])
  const value = "ACCU-SEAL 35-532 Bag Sealer";
  return (
    <div >
      {actionForm=="EDIT USER" || actionForm=="ADD USER"? <Dialog
     
     fullWidth={true}
     maxWidth="lg" style={{ }}  onClose={handleClose}  aria-labelledby="customized-dialog-title" open={open}>
     <DialogTitle style={{ }} id="customized-dialog-title" onClose={handleClose}>
       <div style={{ display: "flex", }}>
         <Paper style={{ width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}><PersonIcon ></PersonIcon></Paper>
         <div style={{width: "300px", height: "50px",  marginLeft:"10px",alignItems:"center",justifyContent:"center" }}>
             
               <span color="primary" style={{display: "flex",lineHeight: "50px", fontFamily:"revert", color:"primary",}}  >{actionForm}</span>
              
         </div> 

       </div>

     </DialogTitle>

     <DialogContent className={classes.root}  >
     <Grid container spacing={1} style={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" ,}} >

      
<Grid item xs={12} sm={6} md={3} >
 <Grid item style={{ padding: "10px" }}>
   <h6 style={{ marginLeft: "10px" }}>1. User</h6>
 
   <TextField style={{ margin: "5px", width: "100%" }}
     label="Username"
     name="username"
     value={dataChange.username}
     placeholder="Username"
     variant="outlined"
     aria-readonly
     onChange={handleChange}
   // error={touched && invalid}
   // helperText={touched && error}
   // {...input}
   // {...custom}
   />
   
   <TextField
     style={{ margin: "5px", width: "100%" }}
     name="name"
     label="Name"
     value={dataChange.name}
     placeholder="name"
     variant="outlined"
     onChange={handleChange}
   // error={touched && invalid}
   // helperText={touched && error}
   // {...input}
   // {...custom}
   />
   <TextField
     style={{ margin: "5px", width: "100%" }}
     name="nik"
     label="Nik"
     value={dataChange.nik}
     onChange={handleChange}
     placeholder="nik"
     variant="outlined"
   // error={touched && invalid}
   // helperText={touched && error}
   // {...input}
   // {...custom}
   />
   <TextField
     style={{ margin: "5px", width: "100%" }}
     name="periode_usage"
     label="Periode Usage"
     type="number"
     value={dataChange.periode_usage}
     onChange={handleChange}
     placeholder="Periode Usage"
     variant="outlined"
   // error={touched && invalid}
   // helperText={touched && error}
   // {...input}
   // {...custom}
   />
<div style={{display:"flex", justifyContent:"center", alignItems:"center", direction:"row",width:"100%", height:"80px"}}>
 
 <div style={{margin:'10px',textAlign:"center"}}>
 <Switch
 checked={dataChange.view}
 onChange={e=>handleChange(convert(e.target.name, e.target.checked))}
 name="view"
 color="primary"
 />
  <br></br>
 <InputLabel>View</InputLabel>
 </div>
 <div style={{margin:'10px',textAlign:"center"}}>
 <Switch
 checked={dataChange.create}
 onChange={e=>handleChange(convert(e.target.name, e.target.checked))}
 name="create"
 color="primary"
 />
  <br></br>
 <InputLabel>Create</InputLabel>
 </div><div style={{margin:'10px',textAlign:"center"}}>
 <Switch
 checked={dataChange.update}
 onChange={e=>handleChange(convert(e.target.name, e.target.checked))}
 name="update"
 color="primary"
 />
  <br></br>
 <InputLabel>Update</InputLabel>
 </div><div style={{margin:'10px', textAlign:"center"}}>
 <Switch
 checked={dataChange.delete}
 onChange={e=>handleChange(convert(e.target.name, e.target.checked))}
 name="delete"
 color="primary"
 />
  <br></br>
 <InputLabel>Delete</InputLabel>
 </div>
 
    </div>
 </Grid>

</Grid>
<Grid item xs={12} sm={6} md={4}   >
 <Grid item style={{ padding: "10px" }}>
   <br></br>
   {/* <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={dataDepart}
      disableCloseOnSelect
      getOptionLabel={(option) => option["Department Name"]}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option["Department Name"]}
        </React.Fragment>
      )}
      style={{ width:"100%", marginTop:"10px"}}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Department" placeholder="Department" />
      )}></Autocomplete> */}
   <Autocomplete
     id="depart"
     name="dept_id"

     options={dataDepart}
     value={dataChange.dept_id?dataDepart.find(v => v["Department Name"]== dataChange.dept_id):''}
     getOptionSelected={(option, value) => option.dept_id === dataChange.dept_id}
     getOptionLabel={(option) => option["Department Name"]?option["Department Name"] :""}
     onChange={(e, value) => handleChange(convert("dept_id", value ? value.dept_id : ''))}
     renderInput={(params) => <TextField name="depart" style={{ margin: "5px", }} {...params} label="Departement" variant="outlined" />}
   />
<Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={dataGroup}
      // value={dataChange.group_id}
      disableCloseOnSelect
      getOptionLabel={(option) => option["Group Name"]}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option["Group Name"]}
        </React.Fragment>
      )}
      style={{ width:"100%", marginTop:"10px"}}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" style={{ margin: "5px", }} label="Group" placeholder="Group" />
      )}></Autocomplete>
   {/* <Autocomplete

     id="group"
     name="group_id"
     options={dataGroup}
     value={dataChange.group_id?dataGroup.find(v => v.group_id == dataChange.group_id):""}
     getOptionSelected={(option, value) => option.group_id === dataChange.group_id}
     getOptionLabel={(option) => option["Group Name"]?option["Group Name"]:""}
     onChange={(e, value) => handleChange(convert("group_id", value ? value.group_id : ''))}
     renderInput={(params) => <TextField style={{ margin: "5px" }} {...params} label="Group" variant="outlined" />}
   />
  */}
  {/* <Autocomplete


options={dataRole}
     value={dataChange.role_id?dataRole.find(v => v.role_id == dataChange.role_id):""}
    //  getOptionSelected={(option, value) => option["Role Name"] === "Admin"}
     getOptionLabel={(option) =>option["Role Name"]?option["Role Name"]:""}
     onChange={(e, value) => handleChange(convert("role_id", value ? value.role_id : ''))}
     renderInput={(params) => <TextField style={{ margin: "5px" }} {...params} label="Role" variant="outlined" />}
   />
   <TextField
     id="date"
     label="Date Expired"
     type="date"
     style={{ margin: "5px", width: "100%" }}
     variant="outlined"
     value={dataChange.expired_date ? dataChange.expired_date : new Date().toDateInputValue()}
     name="expired_date"

     onChange={handleChange}
     className={classes.textField}
     InputLabelProps={{
       shrink: true,

     }}
   /> */}
   <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={dataRole}
      disableCloseOnSelect
      // value={dataChange.role_id.filter((elem) => !dataRole.find(({id = dataRole["Role Name"]}) => elem["Role Name"] === id) )}
      getOptionLabel={(option) => option["Role Name"]}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option["Role Name"]}
        </React.Fragment>
      )}
      style={{ width:"100%", marginTop:"10px"}}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" style={{ margin: "5px", }} label="Role" placeholder="Role" />
      )}></Autocomplete>
   <TextField
     id="date"
     style={{ margin: "5px", width: "100%" }}
     variant="outlined"
     label="Date Status"
     type="date"

     value={dataChange.status_date ? dataChange.status_date : new Date().toDateInputValue()}
     name="status_date"

     onChange={handleChange}
     className={classes.textField}
     InputLabelProps={{
       shrink: true,

     }}
   />
   
   


 </Grid>

</Grid>
<Grid item xs={12} sm={6} md={4} style={{alignSelf:"flex-start", padding:"8px"}} >
<br></br>

 <h6 style={{ marginLeft: "10px" }}>2. Branch</h6>
 <Autocomplete

   id="role"
   name="role_id"

   options={dataBranch}

   getOptionLabel={(option) => option.branch_name?option.branch_name:""}
   getOptionSelected={(option, value) => option.branch_id === dataChange.branch_id}
   onChange={(e, value) => handleChange(convert("branch_id", value ? value.branch_id : ''))}
   renderInput={(params) => <TextField style={{ margin: "10px" }} {...params} label="Branch" variant="outlined" />}
   value={dataChange.branch_id?dataBranch.find(v => v.branch_id == dataChange.branch_id):""}
 />
</Grid>


</Grid>



     </DialogContent>
     <DialogActions style={{}}>
       <Button className={classes.popup} autoFocus onClick={handleSubmitUser} >
         Save
       </Button>
     </DialogActions>
   </Dialog>:
   
   <Dialog
     
   fullWidth={true}
   maxWidth="sm" style={{ }}  onClose={handleClose}  aria-labelledby="customized-dialog-title" open={open}>
   <DialogTitle style={{ }} id="customized-dialog-title" onClose={handleClose}>
     <div style={{ display: "flex", }}>
       <Paper style={{ width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}><PersonIcon ></PersonIcon></Paper>
       <div style={{width: "300px", height: "50px",  marginLeft:"10px",alignItems:"center",justifyContent:"center" }}>
           
             <span color="primary" style={{display: "flex",lineHeight: "50px", fontFamily:"revert", color:"primary",}}  >{actionForm}</span>
            
       </div> 

     </div>

   </DialogTitle>

   <DialogContent className={classes.root}  >
   <Grid container spacing={1} style={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" ,}} >

    
<Grid item xs={12} sm={12} md={12} >
<Grid item style={{ padding: "10px" }}>
<TextField
style={{margin:"5px", width:"100%"}}
label="New Password"
onChange={handleChange}
placeholder="New Password"
helperText={message1}
error={error1}
type={showPassword1 ? "text" : "password"}
variant="outlined"
name="changePass"
InputProps={{ // <-- This is where the toggle button is added.
  endAdornment: (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword1}
        onMouseDown={handleMouseDownPassword1}
      >
        {showPassword1 ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  )
}}
value={dataChange.changePass}
// error={touched && invalid}
// helperText={touched && error}
// {...input}
// {...custom}
/>
<TextField
style={{margin:"5px", width:"100%"}}
label="Confirm Password"
onChange={handleChange}
placeholder="Confirm Password"
variant="outlined"
name="confirmPass"
type={showPassword ? "text" : "password"}
value={dataChange.confirmPass}
helperText={error ? "confirm password do not macth" : message}
error={error}
InputProps={{ // <-- This is where the toggle button is added.
  endAdornment: (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
      >
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  )
}}
// error={touched && invalid}
// helperText={touched && error}
// {...input}
// {...custom}
/>

</Grid>
</Grid>
</Grid>


   </DialogContent>
   <DialogActions style={{}}>
     <Button className={classes.popup} autoFocus onClick={handleSubmitUser} >
       Save
     </Button>
   </DialogActions>
 </Dialog>
   
   }
     
    </div>
  );
}
