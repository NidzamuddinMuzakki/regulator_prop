import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Adapro/Dashboard'));
const Report = React.lazy(() => import('./views/Adapro/Report'));
const CredUser = React.lazy(() => import('./views/Adapro/Credential/User'))
const CredRole = React.lazy(() => import('./views/Adapro/Credential/Role'))
const Kerno = React.lazy(() => import('./views/Adapro/Kerno'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/report', name: 'Report', component: Report },
  { path: '/credential/user', name: 'User Setting', component: CredUser },
  { path: '/credential/role', name: 'Role Setting', component: CredRole },
  { path: '/kerno', name: 'Kerno', component: Kerno },
 
];

export default routes;
