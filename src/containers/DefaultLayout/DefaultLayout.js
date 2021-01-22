import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import {connect} from 'react-redux';
import MailIcon from '@material-ui/icons/Mail';
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';

import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import API from './../../api/api'
import authMethod from "../../auth/authMethod";

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from '@material-ui/icons/Label';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import InfoIcon from '@material-ui/icons/Info';
import ForumIcon from '@material-ui/icons/Forum';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const DataTreeView = ({ treeItems, create, update, delete1, read }) => {
  return (
    <TreeView
    style={{height: 264,
      flexGrow: 1,
      maxWidth: 400,}}
   
    defaultCollapseIcon={<ArrowDropDownIcon />}
    defaultExpandIcon={<ArrowRightIcon />}
    defaultEndIcon={<div style={{ width: 24 }} />}
  >
      {GetTreeItemsFromData(treeItems, create, update, delete1, read)}
    </TreeView>
  );
};

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    // color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: "black",
    
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: "black",
      
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: "black",
     
    },
  },
  content: {
   
    
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
      
    },
  },
  group: {
    marginLeft: 10,
    borderLeft:"1px dashed white",
    '& $content': {
      paddingLeft: theme.spacing(1),
      marginLeft:-5,
      
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
    
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function renderTree(nodes) {
 
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor,children, id,name, ...other } = nodes;

  return(
  
  <TreeItem key={id} nodeId={id}  label={
    <div >
      <LabelIcon color="inherit"  />
      <Typography variant="body2" >
        {name}
      </Typography>
      <Typography variant="caption" color="inherit">
        {name}
      </Typography>
    </div>
  }>
   
  </TreeItem>
);}
function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    > 
    
    </TreeItem>
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};



const GetTreeItemsFromData = (treeItems, create, update, delete1, read) => {
  const classes = useTreeItemStyles();
  return treeItems.map(treeItemData => {
    let children = undefined;
    if (treeItemData.children && treeItemData.children.length > 0) {
      children = GetTreeItemsFromData(treeItemData.children);
    }
    if(treeItemData.length!=0){
    return (
      <TreeItem
        key={treeItemData.menu_id}
        nodeId={treeItemData.menu_id}
        label={
       
            <div className={classes.labelRoot}>
              {treeItemData.url=='' && treeItemData.parent_origin==''?<MailIcon className={classes.labelIcon}></MailIcon>:''}
              {treeItemData.url!=''?<Link style={{textDecoration:"none", color:"white",width:'200%'}} to={treeItemData.url}>
             
              <Typography className={classes.labelText} variant="body2" >
                {treeItemData.name}
              </Typography>
              
              </Link>: 
            
              <Typography className={classes.labelText} variant="body2" >
                {treeItemData.name}
              </Typography>}
              
            </div>
            
          
        }
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          selected: classes.selected,
          group: classes.group,
          label: classes.label,
        }}
        children={children}
      />
    );
      }
  });
};

const Dashboard = React.lazy(() => import('./../..//views/Adapro/Dashboard'));
const Report = React.lazy(() => import('./../../views/Adapro/Report'));
const CredUser = React.lazy(() => import('./../../views/Adapro/Credential/User'))
const CredDepart = React.lazy(() => import('./../../views/Adapro/Credential/Depart'))
const CredGroup = React.lazy(() => import('./../../views/Adapro/Credential/Group/group'))
const CredBranch = React.lazy(() => import('./../../views/Adapro/Credential/Branch'))
const CredRole = React.lazy(() => import('./../../views/Adapro/Credential/Role2'))
const CredLog = React.lazy(() => import('./../../views/Adapro/Log/Log'))
const Menu = React.lazy(() => import('./../../views/Adapro/Credential/Menu'))
const Kerno = React.lazy(() => import('./../../views/Adapro/Kerno'));
const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
const mapDispatchToProps = dispatch =>{
  return {
    
    accessuser:(acreate, aread, aupdate, adelete)=>dispatch({type:"YES", payload:{accesscreate:acreate,accessview:aread,accessupdate:aupdate,accessdelete:adelete}}),
    MenuAccess:(data1)=>dispatch({type:"MenuAccess", payload:{data:data1}}),
    MenuPilihan:(data1)=>dispatch({type:"MenuPilihan", payload:{data:data1}}),

  
  }
}


// const userSelected = state => ({
//   // jumlah: state.userSettingSelected,
//   // terbuka:state.popup,
//   // perpage:state.rowperpageUser,
//   userAcces:state.userAcces,
//   MenuAcces:state.MenuAccess
// })
class DefaultLayout extends Component {
  constructor(props){
    super(props);
    this.state ={
      dataRoutes :[],
      dataAsidemenu:[],
      dataAccess:[],
      create:false,
      update:false,
      read:false,
      delete:false,
      coba:[],
    }
  }
  Auth = new authMethod();
  componentWillMount(){
   
   
      
        Promise.resolve(navigation()).then(hasil=> 
          
          hasil.length>0?this.setState({
            dataAsidemenu:hasil[0],
            dataRoutes:hasil[1],
            dataAccess:hasil[2],
            coba:hasil[3]
          }):this._handleLogout()
               
          
        )
        // this.state.dataRoutes.push( {path: '/', exact: true, name: 'Home' });
        // this.state.dataRoutes.push( {path: '/dashboard', exact: true, name: 'Dashboard' });
        // this.state.dataRoutes.push( {path: '/get_user', exact: true, name: 'user' });
        // this.state.dataRoutes.push( {path: '/get_role', exact: true, name: 'role' });
        // this.state.dataRoutes.push( {path: '/get_department', exact: true, name: 'department' });
        // this.state.dataRoutes.push( {path: '/get_group', exact: true, name: 'group' });
      
          
         
       
        
       
        
        console.log(this.state.dataAsidemenu)
    
  }

  componentDidUpdate(ss, prev,dd){
    // if(prev.dataRoutes!=this.state.dataRoutes || prev.dataAsidemenu!=this.state.dataAsidemenu){
    //   this.setState({
    //     dataAsidemenu:this.state.dataAsidemenu,
    //     dataRoutes:this.state.dataRoutes
    //   })
    // }
      // console.log(this.state.dataAsidemenu)
    


    console.log(this.state.dataAsidemenu)
    console.log(this.state.dataRoutes)
    console.log(this.state.coba)
    if(this.state.dataAccess){
      this.props.MenuAccess(this.state.dataAccess)
      this.props.MenuPilihan(this.state.coba)
    }


    // console.log(this.state.dataAccess)
  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
 
  signOut(e) {
    e.preventDefault()
    this.props.history.replace('/login')
  }
  _handleLogout = () => {
    this.Auth.logout();
    this.props.history.replace('/login');
  }

  render() {
    
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            {/* <DefaultHeader onLogout={e=>this.signOut(e)}/> */}
            <DefaultHeader onLogout={this._handleLogout}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
		
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              {/* {this.state.dataAsidemenu} */}
      
  
      {/* <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon} />
      <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
      <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
        <StyledTreeItem
          nodeId="5"
          labelText="Social"
          labelIcon={SupervisorAccountIcon}
          labelInfo="90"
          color="#1a73e8"
          bgColor="#e8f0fe"
        />
        <StyledTreeItem
          nodeId="6"
          labelText="Updates"
          labelIcon={InfoIcon}
          labelInfo="2,294"
          color="#e3742f"
          bgColor="#fcefe3"
        />
        <StyledTreeItem
          nodeId="7"
          labelText="Forums"
          labelIcon={ForumIcon}
          labelInfo="3,566"
          color="#a250f5"
          bgColor="#f3e8fd"
        />
        <StyledTreeItem
          nodeId="8"
          labelText="Promotions"
          labelIcon={LocalOfferIcon}
          labelInfo="733"
          color="#3c8039"
          bgColor="#e6f4ea"
        />
      </StyledTreeItem>
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} /> */}

{this.state.dataAsidemenu.length>0?<DataTreeView treeItems={this.state.dataAsidemenu} create={this.state.create} read={this.state.read} delete1={this.state.delete} update={this.state.update} />:""}

            {/* {this.state.dataAsidemenu.items?<AppSidebarNav navConfig={this.state.dataAsidemenu}{...this.props} />:''}  */}
            </Suspense>
           
            <AppSidebarFooter />
            {/* <AppSidebarMinimizer /> */}
          </AppSidebar>
		  
          <main className="main">
            <AppBreadcrumb appRoutes={this.state.dataRoutes?this.state.dataRoutes:''} />
				
			      <Container fluid>
              <Suspense fallback={this.loading()}>
          {this.state.dataRoutes.length>0?
          <Switch>
          {this.state.dataRoutes?this.state.dataRoutes.map((route, idx) => {
        

              return (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  
                 >
                   {route.name=="Dashboard"?<Dashboard></Dashboard>:route.name=="user"?<CredUser></CredUser>
                   :route.name=="role"?<CredRole></CredRole>:route.name=="log action"?<CredLog></CredLog>:route.name=="group"?<CredGroup></CredGroup>:
                   route.name=="department"?<CredDepart></CredDepart>:route.name=="branch"?<CredBranch></CredBranch>:<Dashboard></Dashboard>}
                 </Route>
              )
       
          }):''}
          <Redirect from="/" to="/dashboard" />
          
        </Switch>  

          
          :''}      
				        
              </Suspense>
            </Container>
			
          </main>
		  
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
		  
        </div>

        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
		
      </div>
    );
  }
}

export default connect(null,mapDispatchToProps)(DefaultLayout);
