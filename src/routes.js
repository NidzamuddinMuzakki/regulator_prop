import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Adapro/Dashboard'));
const Report = React.lazy(() => import('./views/Adapro/Report'));
const CredUser = React.lazy(() => import('./views/Adapro/Credential/User'))
const CredDepart = React.lazy(() => import('./views/Adapro/Credential/Depart'))
const CredGroup = React.lazy(() => import('./views/Adapro/Credential/Group/group'))
const CredBranch = React.lazy(() => import('./views/Adapro/Credential/Branch'))
const CredRole = React.lazy(() => import('./views/Adapro/Credential/Role2'))
const Kerno = React.lazy(() => import('./views/Adapro/Kerno'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/report/reportA', name: 'Report', component: Report },
  { path: '/usersetting/user', name: 'User Setting / User', component: CredUser },
  { path: '/usersetting/depart', name: 'User Setting / Depart', component: CredDepart },
  { path: '/usersetting/group', name: 'User Setting / Group', component: CredGroup },
  { path: '/usersetting/branch', name: 'User Setting / Branch', component: CredBranch },
  { path: '/credential/role', name: 'Role Setting', component: CredRole },
  { path: '/kerno', name: 'Kerno', component: Kerno },
 
];

export default routes;
