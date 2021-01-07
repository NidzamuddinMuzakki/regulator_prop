import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};
const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dateObj = new Date();
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = day + ' ' + month  + " " + year;
class DefaultHeader extends Component {
  
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
       
        <Nav className="ml-auto" navbar>
      
        <AppHeaderDropdown direction="up">
      
          <DropdownToggle nav >
         <br></br>

          Cabang<ArrowDropDownIcon/>
          </DropdownToggle>
          <DropdownMenu right style={{ left: 'auto' }}>
            <DropdownItem header tag="div" className="text-center"><strong>Menu</strong></DropdownItem>
            <DropdownItem><i className="fa fa-user"></i> Lain</DropdownItem>
            <DropdownItem><i className="fa fa-wrench"></i> Berapa</DropdownItem>
            {/* <DropdownItem divider />
            <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem> */}
          </DropdownMenu>
        </AppHeaderDropdown>



        <AppHeaderDropdown direction="up">
        <p style={{marginLeft:"-35px"}}>{output}</p>
          <DropdownToggle nav style={{marginTop:"-14px"}} >
         

          Periode<ArrowDropDownIcon/>
          </DropdownToggle>
          <DropdownMenu right style={{ left: 'auto' }}>
            <DropdownItem header tag="div" className="text-center"><strong>Menu</strong></DropdownItem>
            <DropdownItem><i className="fa fa-user"></i> Lain</DropdownItem>
            <DropdownItem><i className="fa fa-wrench"></i> Berapa</DropdownItem>
            {/* <DropdownItem divider />
            <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem> */}
          </DropdownMenu>
        </AppHeaderDropdown>



          <AppHeaderDropdown direction="up">
          
            <DropdownToggle nav>
              <img src={'../../assets/img/avatars/6.jpg'} className="img-avatar" alt="admin" />
            </DropdownToggle>
            <DropdownMenu right style={{ left: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
