import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import set from 'core-js/es6/set';
import {useSelector,useDispatch} from 'react-redux';
import Tabs from  '../tabkomponen/tabs.js';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';




function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  // console.log("hay"+props.data)
  const headCells = [];
  let i=0;
  if(props.schema){
    for(const key of props.schema ){
      if(i==0){
        headCells.push({ id: 'no', numeric: true, disablePadding: true, label: 'No' })
  
      }
      else{
        headCells.push({ id: key, numeric: false, disablePadding: false, label: key })
      }
      i++;
    }
    
  }


  // const headCells = [
  //   { id: 'no', numeric: true, disablePadding: true, label: 'No' },
  //   { id: 'dept_id', numeric: false, disablePadding: false, label: 'ID' },
  //   { id: 'dept_name', numeric: false, disablePadding: false, label: 'Department' },
  //   { id: 'group_name', numeric: false, disablePadding: false, label: 'Group' },
  //   { id: 'create_time', numeric: false, disablePadding: false, label: 'Create Time' },
  //   { id: 'update_time', numeric: false, disablePadding: false, label: 'Update Time' },
 


  // ];
  
  return (
  
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
           color = "primary"
           indeterminateIcon={<RemoveCircleIcon/>}
           icon={<RadioButtonUncheckedIcon></RadioButtonUncheckedIcon>}
           checkedIcon={<CheckCircleIcon></CheckCircleIcon>}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
           
            padding={'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
           
              {headCell.label}
             
           
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: "#0078d4",
        backgroundColor: "#c7e0f4",
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {props.name}
        </Typography>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 400,
  },
  tableRow: {
    
    "&$selected,&$hover:hover": {
      backgroundColor: "#c7e0f4"
    },
    
  },
  // tableCell: {
  //   "$hover:hover &": {
  //     color: "pink"
  //   }
  
  hover: {},
  selected: {},
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const selectedusersetting = useSelector(state =>state.userSettingSelected);
  const dispatch = useDispatch();
  const [hiding, setHiding] = React.useState("none");
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  let deptName = [];
  
  function createData(id,no,deptName,groupName ,crtDate, updDate) {
    return { id,no,deptName,groupName,crtDate, updDate };
  }
  const rows = [];
  
  let dataUser = props.data;
  let nomorTogel = rowsPerPage*(page+1)-rowsPerPage;
// console.log(props.deptName[0])
  for(let i=0;i<dataUser.length;i++){
    nomorTogel++;
   
    rows[i] = createData(dataUser[i].dept_id,(nomorTogel),dataUser[i].dept_name,props.groupName[i] ,dataUser[i].created_time, dataUser[i].updated_time);
    
  }

  
  


  const kirimuserselected = (jumlah, data)=>{
    return{
      type:"SELECTEDUSER",
      payload:{
        selectedUser: jumlah,
        selectedId:data
      }
    }
  }
  let handleLeave = (e)=>{
    
    if(e.target.nodeName=="INPUT"){
      e.target.parentNode.parentNode.style.display="none";
    }
    else if(e.target.parentNode==null){

    }else if(e.target.parentNode.children[0]==null){

    }else if(e.target.parentNode.children[0].children[0]==null){

    }
    else{
      e.target.parentNode.children[0].children[0].style.display="none";
    }
  }
  let handleEnter = (e)=>{
    if(e.target.parentNode==null){

    }else if(e.target.parentNode.children[0]==null){

    }else if(e.target.parentNode.children[0].children[0]==null){

    }else{
      e.target.parentNode.children[0].children[0].style.display="block";
    }
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const kirimurowperpage = (jumlah, halaman)=>{
    return{
      type:"CHANGEROWBRANCH",
      payload:{
        jumlah: jumlah,
        halaman:halaman
      }
    }
  }
  const handleSelectAllClick = (event) => {
    if(selected.length>0){
      dispatch(kirimuserselected(0,[]))
      setSelected([]);
    }
    else if (event.target.checked) {
      const newSelecteds = props.data.map((n) => n[props.schema[0]]);
      let jumlah = newSelecteds.length;
      
   
      dispatch(kirimuserselected(jumlah,newSelecteds))
      setSelected(newSelecteds);
      return;
    }
    dispatch(kirimuserselected(0,[]))
    setSelected([]);
  };
  useEffect(()=>{
    if(selected.length>0){
      setHiding("block");
     

        
      
    }else{
      setHiding("none")
    }
   
  },[selected])
 
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    
    
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    let jumlah = newSelected.length;

   
    dispatch(kirimuserselected(jumlah,newSelected))
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(kirimurowperpage(rowsPerPage, newPage+1))
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    dispatch(kirimurowperpage(event.target.value, 1))
    setPage(0);
    
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  // console.log(rows)
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
      {/* <Tabs>
        <div label="Gator">
          See ya later, <em>Alligator</em>!
        </div>
        <div label="Croc">
          After 'while, <em>Crocodile</em>!
        </div>
        <div label="Sarcosuchus">
          Nothing to see here, this tab is <em>extinct</em>!
        </div>
      </Tabs> */}
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              schema={props.schema}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.jumlahdata}
              
            />
            <TableBody>
              {
                props.data.map((row, index) => {
                  
                  const isItemSelected = isSelected(row[props.schema[0]]);
                  const labelId = `enhanced-table-checkbox-${row[props.schema[0]]}`;
                  
                  return (
                    <TableRow
                      id="rowcheck"
                      hover
                      className={classes.tableRow}
                      classes={{ hover: classes.hover, selected:classes.selected }}
                      style={{cursor:"pointer"}}
                      onMouseEnter={selected.length==0?handleEnter:null}
                      onMouseLeave={selected.length==0?handleLeave:null}
                      onClick={(event) => handleClick(event, row[props.schema[0]])}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell  padding="checkbox">
                        <Checkbox style={{display:hiding}}
                          checked={isItemSelected}
                          icon={<RadioButtonUncheckedIcon></RadioButtonUncheckedIcon>}
                          checkedIcon={<CheckCircleIcon></CheckCircleIcon>}
                          color = "primary"
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                     
                      <TableCell >
                        {index+1+(rowsPerPage*(page+1)-rowsPerPage)}
                      </TableCell>
                      {props.schema.map((field, index1)=>{
                          if(index1==0){

                          }
                          else{
                           return(
                            
                            <TableCell key={index1} >
                            {row[field]}
                            </TableCell>

                           );
                          } 
                      })}
                      {/* <TableCell  >
                        {row.id}
                      </TableCell>
                      <TableCell  >{row.deptName}</TableCell>
                      <TableCell  >{row.groupName}</TableCell>
                      <TableCell  >{row.crtDate}</TableCell>
                      <TableCell  >{row.updDate}</TableCell> */}
                      
                      
                      
                    </TableRow>
                  );
                })}
           
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
         style={{height:'50px',paddingTop:'-20px'}}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.jumlahdata}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}