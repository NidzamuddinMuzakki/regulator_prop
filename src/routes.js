import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
import API from './api/api';

let token = localStorage.getItem('id_token');
// var fetches = [];
// let dataMenu = [];
// const Dashboard = React.lazy(() => import('./views/Adapro/Dashboard'));
// const Report = React.lazy(() => import('./views/Adapro/Report'));
// const CredUser = React.lazy(() => import('./views/Adapro/Credential/User'))
// const CredDepart = React.lazy(() => import('./views/Adapro/Credential/Depart'))
// const CredGroup = React.lazy(() => import('./views/Adapro/Credential/Group/group'))
// const CredBranch = React.lazy(() => import('./views/Adapro/Credential/Branch'))
// const CredRole = React.lazy(() => import('./views/Adapro/Credential/Role2'))
// const Menu = React.lazy(() => import('./views/Adapro/Credential/Menu'))
// const Kerno = React.lazy(() => import('./views/Adapro/Kerno'));
// fetches.push(API.post("/credential_service/get_menu", {
//     key: token,
   
//     info_data: "all"
//   }).then(data => {
//         dataMenu = data.data.data
//     }) )
// Promise.all(fetches).then((hasil)=>{
// })
  
  const DataMenu = [];
  
 
let getDevices = async () => {
  
  const settings = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({key: token, info_data: 'all'})
  };
  try {
      const fetchResponse = await fetch(`http://34.101.137.236:8080/credential_service/get_menu`, settings);
      const data = await fetchResponse.json();
      DataMenu.push({path: '/', exact: true, name: 'Home' });
      DataMenu.push({path: '/dashboard', name: 'Dashboard'});
    for(const key of data.dataOrigin){
      if(key.url!=""){
        DataMenu.push({path:key.url, name:key.name})
      }
    }



    //  for(const key of data.posted.dataChanged){
       
    //   if(key.url!=""){
    //     DataMenu.push({path: key.url, name: key.name})

    //   }else{
    //     for(const child of key.children){
    //       if(child.url!=''){
    //         DataMenu.push({path: child.url, name: child.name})
    //       }else{
    //         for(const child1 of child.children){
    //           if(child1.url!=''){
    //             DataMenu.push({path: child1.url, name: child1.name})
    //           }else{
    //             for(const child2 of child1.children){
    //               if(child2.url!=''){
    //                 DataMenu.push({path: child2.url, name: child2.name})
    //               }else{
    //                 for(const child3 of child2.children){
    //                   if(child3.url!=''){
    //                     DataMenu.push({path: child3.url, name: child3.name, component: CredUser})
    //                   }
    //                 } 
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   } 

    //  }
     
      
      return DataMenu;
  } catch (e) {
      return e;
  }    

}



export default getDevices
// export const  routes = [
//   { path: '/', exact: true, name: 'Home', component: DefaultLayout },
//   { path: '/dashboard', name: 'Dashboard', component: Dashboard },
//   { path: '/menu', name: 'Menu', component: Menu },
//   { path: '/report/reportA', name: 'Report', component: Report },
//   { path: '/usersetting/user', name: 'User Setting / User', component: CredUser },
//   { path: '/usersetting/depart', name: 'User Setting / Depart', component: CredDepart },
//   { path: '/usersetting/group', name: 'User Setting / Group', component: CredGroup },
//   { path: '/usersetting/branch', name: 'User Setting / Branch', component: CredBranch },
//   { path: '/usersetting/role', name: 'Role Setting / Role', component: CredRole },
//   // { path: '/kerno', name: 'Kerno', component: Kerno },
 
// ];


