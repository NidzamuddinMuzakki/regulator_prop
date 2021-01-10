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
  const headCells = [
    { id: 'no', numeric: true, disablePadding: true, label: 'No' },
    { id: 'username', numeric: false, disablePadding: false, label: 'Username' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'password', numeric: false, disablePadding: false, label: 'Password' },
    { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
    { id: 'nik', numeric: false, disablePadding: false, label: 'Nik' },
    { id: 'dept', numeric: false, disablePadding: false, label: 'Departement' },
    { id: 'group', numeric: false, disablePadding: false, label: 'Group' },


  ];
  
  return (
  
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
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
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
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
    minWidth: 750,
  },
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
  
  function createData(id,no,username, name, password,role,nik, dept, group) {
    return { id,no,username, name, password,role, nik, dept, group };
  }
  const rows = [];
  
  let dataUser = props.data;
// console.log(props.deptName[0])
  for(let i=0;i<dataUser.length;i++){
    rows[i] = createData(dataUser[i].user_id,(i+1),dataUser[i].username, dataUser[i].name, dataUser[i].password,props.roleName[i], dataUser[i].nik,props.deptName[i], props.groupName[i]);
    
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

  const handleSelectAllClick = (event) => {
    if(selected.length>0){
      dispatch(kirimuserselected(0,[]))
      setSelected([]);
    }
    else if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
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
  useEffect(()=>{
    setSelected([]);
  }, [props.data])
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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;
                  
                  return (
                    <TableRow
                      id="rowcheck"
                      hover
                      style={{cursor:"pointer"}}
                      onMouseEnter={selected.length==0?handleEnter:null}
                      onMouseLeave={selected.length==0?handleLeave:null}
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell  padding="checkbox">
                        <Checkbox style={{display:hiding}}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell >
                        {row.no}
                      </TableCell>
                      <TableCell  >
                        {row.username}
                      </TableCell>
                      <TableCell  >{row.name}</TableCell>
                      
                      <TableCell >{row.password}</TableCell>
                      <TableCell  >{row.role}</TableCell>
                      <TableCell >{row.nik}</TableCell>
                      
                      <TableCell  >{row.dept}</TableCell>
                   
                      <TableCell >{row.group}</TableCell>
                      
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}