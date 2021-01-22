import React from 'react';
import { withStyles, useStyle, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';

import Checkbox from '@material-ui/core/Checkbox';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
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
const [dataDetail, setDataDetail] = React.useState([]);
const [dataDetailBefore, setDataDetailBefore] = React.useState([]);
const [dataDetailAfter, setDataDetailAfter] = React.useState([]);
const [dataDetailColoumns, setDataDetailColoumns] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState([]);
//   console.log(open)
  Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  });
  

  const selectedusersetting = useSelector(state => state.userSettingSelected);
  const dataMenuRedux = useSelector(state=>state.menupilihan.menu);
  // const [username, setUsername] = React.useState("");
  // const [password, setPassword] = React.useState("");
  // const [name, setName] = React.useState("");
  // const [userid, setUserId] = React.useState("");
  const [ambildataMenu, setAmbildataMenu] = React.useState([]);
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
   branch_name:'',
   menu_id:'',
   report_id:'',
   module_id:'',
   menu_url:'',
   menu_id:'',
   menu_desc:'',
   
   menu:dataMenuRedux,
  })
  
 
  let actionForm = props.actionForm;
 
 
  const isOpenDepart = useSelector(state=>state.popupDepart.isOpen)
  const isOpenGroup = useSelector(state=>state.popupGroup.isOpen)
  
  const selected = useSelector(state => state.userSettingSelected);
  
  const getDetail = React.useCallback((id) => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("get_log", {
      key: token,
      action_id: id ,
      info_data: "detail"
    }).then(data => {
      let uaja = data.data.data;
      let ambilafter  = uaja[0].data_after;
      let ambilbefore  = uaja[0].data_before;
      let parseAmbilafter = ambilafter?Object.values(JSON.parse(ambilafter)):[];
      let parseAmbilbefore = ambilbefore?Object.values(JSON.parse(ambilbefore)):[];
      let columns = ambilafter?Object.keys(JSON.parse(ambilafter)):Object.keys(JSON.parse(ambilbefore));
      setDataDetail(uaja[0])
      setDataDetailAfter(parseAmbilafter);
      setDataDetailBefore(parseAmbilbefore);
      setDataDetailColoumns(columns)
        
    })
    
    },[setDataDetail]  ) 
    const getBranchDetail = React.useCallback((id) => {  //on startup function
        let token = localStorage.getItem('id_token');
    
        // API.post("get_branch", {
        //   key: token,
        //   branch_id: id,
        //   info_data: "detail"
        // }).then(data => {
        //   let uaja = data.data.data;
          
        //   setDataChange({
        //         branch_name:data.data.data.branch_name,
        //         branch_id:data.data.data.branch_id,
                
        //     }) 
        // })
        
    },[setDataChange])
useEffect(()=>{
  console.log(dataChange.menu)
  console.log(props.dataMenuAction)
 
  
},[dataMenuRedux])
const getGroupDetail = React.useCallback((id) => {  //on startup function
    let token = localStorage.getItem('id_token');

    API.post("get_group", {
      key: token,
      group_id: id,
      info_data: "detail"
    }).then(data => {
      let uaja = data.data.data;
    
      console.log(uaja["Group Name"])
      setDataChange({
            group_name:uaja["Group Name"],
            group_id:uaja["Group Id"]
        }) 
    })
    
},[setDataChange])

const getMenuDetail = React.useCallback((id) => {  //on startup function
  let token = localStorage.getItem('id_token');

  // API.post("get_menu", {
  //   key: token,
  //   menu_id: id,
  //   info_data: "detail"
  // }).then(data => {
  //   let uaja = data.data.data;
    
  //   setDataChange({
  //         menu_url:data.data.data.menu_url,
  //         menu_id:data.data.data.menu_id,
  //         menu_desc:data.data.data.menu_desc
  //     }) 
  // })
  
},[setDataChange])
const getRoleDetail = React.useCallback((id) => {  //on startup function
  let token = localStorage.getItem('id_token');
 
  API.post("get_role", {
    key: token,
    role_id: id,
    info_data: "detail"
  }).then(data => {
    let uaja = data.data.data;
    let menubaru = [];
    console.log(data.data.data)
    let i = 0;
    for(const uuu of data.data.data.Menu){
      console.log(dataChange.menu[i])
      console.log(uuu.Name)
      for(const dataMenu of dataChange.menu){
        if(dataMenu.Name==uuu.Name){
          menubaru.push(uuu)
        }
      }
    }
    if(menubaru.length==0){
      menubaru = dataChange.menu;
    }
    setDataChange({
          role_name:data.data.data["Role Name"],
          role_id:id,
          menu:menubaru
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

    API.post("get_group", {
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
      API.post("update_department", {
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
      API.post("create_department", {
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
        API.post("create_branch", {
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
      else  if (actionForm == "Add Role") {
        API.post("create_role", {
          key: token,
          
          role_id:dataChange.role_id,
          role_name:dataChange.role_name,
          menu_id:dataChange.menu_id,
          report_id:dataChange.report_id,
          module_id:dataChange.module_id,
         
  
        }).then(data => {
  
          // console.log(data.data)
          alert("berhasil menambah")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEROLE"))
          resetForm();
          // this.setState({
          //   dataSet: data.data.data
          // });
  
        })
      }
      else if (actionForm == "Edit Role") {
        API.post("update_role", {
          key: token,
        
          role_id:dataChange.role_id,
          role_name:dataChange.role_name,
          menu_id:dataChange.menu_id,
          report_id:dataChange.report_id,
          module_id:dataChange.module_id,
        }).then(data => {
  
          // console.log(data.data)
          alert("berhasil Mengubah")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEROLE"))
          resetForm();
          // this.setState({
          //   dataSet: data.data.data
          // });
  
        }).catch((err) => {
          alert("Anda Bukan Admin")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEROLE"))
          resetForm();
        })
      }
    else  if (actionForm == "Add Group") {
        API.post("create_group", {
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
      else  if (actionForm == "Add Menu") {
        API.post("create_menu", {
          key: token,
          
         
          menu_id:dataChange.menu_id,
          menu_desc:dataChange.menu_desc,
          menu_url:dataChange.menu_url
  
        }).then(data => {
  
          // console.log(data.data)
          alert("berhasil menambah")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEMENU"))
          resetForm();
          // this.setState({
          //   dataSet: data.data.data
          // });
  
        })
      }
      else if (actionForm == "Edit Menu") {
        API.post("update_menu", {
          key: token,
          menu_id:dataChange.menu_id,
          menu_desc:dataChange.menu_desc,
          menu_url:dataChange.menu_url
  
        }).then(data => {
  
          // console.log(data.data)
          alert("berhasil Mengubah")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEMENU"))
          resetForm();
          // this.setState({
          //   dataSet: data.data.data
          // });
  
        }).catch((err) => {
          alert("Anda Bukan Admin")
          setOpen(false);
          dispatch(kirimisOpen(false,"CLOSEMENU"))
          resetForm();
        })
      }
     else if (actionForm == "Edit Group") {
        API.post("update_group", {
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
        API.post("update_branch", {
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

        branch_name:'',
        menu_id:'',
        report_id:'',
        module_id:'',
        menu_url:'',
        menu_id:'',
        menu_desc:'',
        menu:dataMenuRedux
   
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
    dispatch(kirimuserselected(0,[]))
    // if(props.actionForm=="Add Department"||props.actionForm=="Edit Department"){
    //     dispatch(kirimisOpen(false,"CLOSEDEPART"))
     

    // }else if(props.actionForm=="Add Group" || props.actionForm=="Edit Group"){
    //     dispatch(kirimisOpen(false,"CLOSEGROUP"))
       
    // }
    // else if(props.actionForm=="Add Branch" || props.actionForm=="Edit Branch"){
    //     dispatch(kirimisOpen(false,"CLOSEBRANCH"))
       
    // }
    // else if(props.actionForm=="Add Role" || props.actionForm=="Edit Role"){
    //   dispatch(kirimisOpen(false,"CLOSEROLE"))
    // }
    // else if(props.actionForm=="Add Menu" || props.actionForm=="Edit Menu"){
   
    // }
    // dispatch(kirimisOpen(false,"CLOSEMENU"))
    setOpen(false);
    props.onClick(false)
    resetForm();

  },[open]);

  useEffect(() => {
    setOpen(props.open) 
    if(props.open==true){
        getDetail(props.selectedDetail);
    }
    

  }, [props.open])
  const value = "ACCU-SEAL 35-532 Bag Sealer";
  return (
    <div >

      <Dialog
     
        fullWidth={true}
        maxWidth={"md"} style={{ }}  onClose={handleClose}  aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle style={{ }} id="customized-dialog-title" onClose={handleClose}>
          <div style={{ display: "flex", }}>
            <Paper style={{ width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}><PersonIcon ></PersonIcon></Paper>
            <div style={{width: "300px", height: "50px",  marginLeft:"10px",alignItems:"center",justifyContent:"center" }}>
                
                  <span color="primary" style={{display: "flex",lineHeight: "50px", fontFamily:"revert", color:"primary",}}  >{ "Detail Data "+dataDetail.action_information+" "+props.selectedDetail}</span>
                 
            </div> 

          </div>

        </DialogTitle>

        <DialogContent className={classes.root}  >
          <Grid container spacing={1} style={{display:'flex', justifyContent:'center', alignItems:'center' ,}} >
            <Grid item xs={3} sm={3}>
                <span style={{fontWeight:'bold'}}>Coloumn</span>
                <hr></hr>
                
                {dataDetailColoumns.map((data, index)=>(
                    <div style={{borderBottom:"1px dashed black"}}>{data}</div>
                ))}
               
            </Grid> 
            <Grid item xs={3} sm={3}>
            <span style={{fontWeight:'bold'}}>Data Before</span>
                <hr></hr>
                
                {dataDetailBefore.length>0?dataDetailBefore.map((data,index)=>(
                    <div style={{borderBottom:"1px dashed black"}}>{data}</div>
                )):dataDetailColoumns.map((data, index)=>(
                    <div style={{borderBottom:"1px dashed black"}}>{"null"}</div>
                ))}
                   
                
            </Grid> 
            <Grid item xs={3} sm={3}>
            <span style={{fontWeight:'bold'}}>After</span>
                <hr></hr>
               
                {dataDetailAfter.length>0?dataDetailAfter.map((data,index)=>(
                    <div style={{borderBottom:"1px dashed black"}}>{data?data:'null'}</div>
                )):dataDetailColoumns.map((data, index)=>(
                    <div style={{borderBottom:"1px dashed black"}}>{"null"}</div>
                ))}
                
                    
                
                   
               
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
