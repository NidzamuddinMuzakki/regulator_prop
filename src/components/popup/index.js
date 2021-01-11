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
  const getUserDetail = (id) => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("/credential_service/get_user", {
      key: token,
      user_id: id,
      info_data: "detail"
    }).then(data => {
      let uaja = data.data.data;
      setDataChange({
        username:uaja.username,
        password:uaja.password,
        name:uaja.name,
        user_id:uaja.user_id,
        group_id:uaja.group_id,
        nik:uaja.nik,
        dept_id:uaja.dept_id,
        role_id:uaja.role_id,
        periode_usage:uaja.periode_usage,
        branch_id:uaja.branch_id,
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





  const getUserDept = () => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("/credential_service/get_department", {
      key: token,
      info_data: 'all'
    }).then(data => {

      setDataDepart(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });

    })
  }

  const getUserGroup = () => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("/credential_service/get_group", {
      key: token,
      info_data: 'all'
    }).then(data => {

      setDataGroup(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });

    })
  }
  const getUserRole =  React.useCallback(() => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("/credential_service/get_role", {
      key: token,
      info_data: 'all'
    }).then(data => {

      setDataRole(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });

    })
  })
  const getUserBranch = () => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("/credential_service/get_branch", {
      key: token,
      info_data: 'all'
    }).then(data => {

      setDataBranch(data.data.data)
      // this.setState({
      //   dataSet: data.data.data
      // });

    })
  }





  
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
    dispatch(kirimuserselected(0, []))
    if (actionForm == "EDIT USER") {
      API.post("/credential_service/update_user", {
        key: token,
        user_id: dataChange.user_id,
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

      }).then(data => {

        // console.log(data.data)
        alert("berhasil Mengubah")
        setOpen(false);
        dispatch(kirimisOpen(false))
        resetForm();
        // this.setState({
        //   dataSet: data.data.data
        // });

      }).catch((err) => {
        alert("Anda Bukan Admin")
        setOpen(false);
        dispatch(kirimisOpen(false))
        resetForm();
      })
    } else {
      API.post("/credential_service/create_user", {
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
      
      }).then(data => {

        // console.log(data.data)
        console.log(dataChange.expired_date)
        alert("berhasil menambah")
        setOpen(false);
        dispatch(kirimisOpen(false))
        resetForm();
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
    expired_date:new Date().toDateInputValue(),
    status_date:new Date().toDateInputValue()
    })
  }
  const handleClose = () => {
    setOpen(false);
    dispatch(kirimisOpen(false))
    dispatch(kirimuserselected(0,[]))
    resetForm();

  };

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

  }, [isOpen])
  const value = "ACCU-SEAL 35-532 Bag Sealer";
  return (
    <div >

      <Dialog
     
        fullWidth={true}
        maxWidth="lg" style={{ }}  onClose={handleClose}  aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle style={{ }} id="customized-dialog-title" onClose={handleClose}>
          <div style={{ display: "flex", }}>
            <Paper style={{ width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}><PersonIcon ></PersonIcon></Paper>
            <div style={{width: "300px", height: "50px",  marginLeft:"10px",alignItems:"center",justifyContent:"center" }}>
                
                  <span color="primary" style={{display: "flex",lineHeight: "50px", fontFamily:"revert", color:"primary",}}  >ADD USER</span>
                 
            </div> 

          </div>

        </DialogTitle>

        <DialogContent className={classes.root}  >
          <Grid container spacing={1} style={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" ,}} >


            <Grid item xs={12} sm={6} md={3} >
              <Grid item style={{ padding: "10px" }}>
                <h6 style={{ marginLeft: "10px" }}>1. User</h6>
                <TextField
   style={{margin:"5px", width:"100%"}}
   label="User Id"
   onChange={handleChange}
   placeholder="User Id"
   variant="outlined"
   name="user_id"
   value={dataChange.user_id}
   // error={touched && invalid}
   // helperText={touched && error}
   // {...input}
   // {...custom}
   />
                <TextField style={{ margin: "5px", width: "100%" }}
                  label="Username"
                  name="username"
                  value={dataChange.username}
                  placeholder="Username"
                  variant="outlined"
                  onChange={handleChange}
                // error={touched && invalid}
                // helperText={touched && error}
                // {...input}
                // {...custom}
                />
                <TextField
                  style={{ margin: "5px", width: "100%" }}
                  label="Password"
                  value={dataChange.password}
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

              </Grid>

            </Grid>
            <Grid item xs={12} sm={6} md={4}   >
              <Grid item style={{ padding: "10px" }}>
                <br></br>
                <Autocomplete
                  id="depart"
                  name="dept_id"

                  options={dataDepart}
                  // value={dataChange.dept_id?dataDepart.find(v => v.dept_id == dataChange.dept_id):''}
                  getOptionSelected={(option, value) => option.dept_id === dataChange.dept_id}
                  getOptionLabel={(option) => option.dept_name?option.dept_name :""}
                  onChange={(e, value) => handleChange(convert("dept_id", value ? value.dept_id : ''))}
                  renderInput={(params) => <TextField name="depart" style={{ margin: "5px", }} {...params} label="Departement" variant="outlined" />}
                />

                <Autocomplete

                  id="group"
                  name="group_id"
                  options={dataGroup}
                  // value={dataChange.group_id?dataGroup.find(v => v.group_id == dataChange.group_id):""}
                  getOptionSelected={(option, value) => option.group_id === dataChange.group_id}
                  getOptionLabel={(option) => option.group_name?option.group_name:""}
                  onChange={(e, value) => handleChange(convert("group_id", value ? value.group_id : ''))}
                  renderInput={(params) => <TextField style={{ margin: "5px" }} {...params} label="Group" variant="outlined" />}
                />
                <Autocomplete

   

options={dataRole}
                  // value={dataChange.role_id?dataRole.find(v => v.role_id == dataChange.role_id):""}
                  getOptionSelected={(option, value) => option.role_name === "Admin"}
                  getOptionLabel={(option) =>option.role_name?option.role_name:""}
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
                />
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
              
              <h6 style={{ marginLeft: "10px" }}>2. Branch</h6>
              <Autocomplete

                id="role"
                name="role_id"

                options={dataBranch}

                getOptionLabel={(option) => option.branch_name?option.branch_name:""}
                getOptionSelected={(option, value) => option.branch_id === dataChange.branch_id}
                onChange={(e, value) => handleChange(convert("branch_id", value ? value.branch_id : ''))}
                renderInput={(params) => <TextField style={{ margin: "10px" }} {...params} label="Branch" variant="outlined" />}
                // value={dataChange.branch_id?dataBranch.find(v => v.branch_id == dataChange.branch_id):""}
              />
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
