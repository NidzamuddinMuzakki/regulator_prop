import { push } from "core-js/fn/array";

let DataMenu = [];
let DataRoute = [];
let DataAccesMenu = [];
let HasilSemua = {items:''};
let cobaja = [];
function getNestedChildren(arr, parent){
  var out =[];
  for(let i in arr){
    if(arr[i].parent_origin==parent && arr[i].access_view!="false"){
      var children = getNestedChildren(arr, arr[i].menu_id)
      // children.map((data, index)=>{
      //   if(data.access_view==="false"){
      //     children.splice(index,1);
      //   }
      // })
      // for(let i=0;i<children.length;i++){
      //   if(children[i].access_view==="false"){
      //     children.splice(i, 1);
      //     // i=0;
      //     cobaja.push(i)
      //   }
      // }
      if(children.length  && arr[i].url==""){
        arr[i].children = children
        out.push(arr[i])
      }else if(arr[i].url!=""){
        out.push(arr[i])

      }
    }
  }
  return out
}

let getDevices = async () => {
  let token = localStorage.getItem('id_token');
  const settings = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({key: token, info_data: 'all'})
  };
  try {
      const fetchResponse = await fetch(`http://34.101.137.61:22112/credential_service/get_menu`, settings);
      const data = await fetchResponse.json();
    
      let Level =  [];
      let Mencoba = data.dataOrigin;
    
      
      
      
      
      
      
      HasilSemua.items = data.dataChanged
     
      DataMenu.push(getNestedChildren(data.dataOrigin, ''));
     
      const cuy = getNestedChildren(data.dataOrigin, '')
      DataRoute.push({path: '/', exact: true, name: 'Home' });
      DataRoute.push({path: '/dashboard', name: 'Dashboard'});



      let Menu = [];
      
      for(const key of data.dataOrigin){
        if(key.url!="" && key.access_view!="false" ){
          DataRoute.push({path:key.url, name:key.name})
          DataAccesMenu.push(key);
        }
        if(key.url!=""){
          Menu.push({Name:key.name, "View":"true", "Create":"true", "Update":"true", "Delete":"true"})
        }
      }
      DataMenu.push(DataRoute)
      DataMenu.push(DataAccesMenu)
      DataMenu.push(Menu) 
//      for(const cuy of data.data){
//       if(cuy.menu_type=="parent" && cuy.menu_level==4){
//         DataMenu.push(
           
//                 {
//                         id:cuy.menu_id,
//                         name: cuy.menu_name,
//                         url: cuy.menu_url,
//                         icon: 'icon-speedometer',
//                         badge: {
//                           variant: 'info',
//                         }

                     
                        
                      
//               }
            
//         )
                  
//       }else if(cuy.menu_type=="parent" ){
//         DataMenu.push(
           
//           {
//                   id:cuy.menu_id,
//                   name: cuy.menu_name,
//                   url: '#2',
//                   icon: 'icon-speedometer',
                  

//                   children:''
                  
                
//         }
      
//   )
//       }       
//    }
//    for(const da of DataMenu){
//     let DataChild = [];
//     let m = 0;
//      for(const ja of data.data){
//        if(ja.menu_type=="child" && ja.parent_origin == da.id){
//          m=ja.parent_origin;
//          DataChild.push({
//                      name: ja.menu_name,
//                      url: ja.menu_url,
//                   })
//        }
       
//      }
//      if(m==da.id){
//        da.children = DataChild

//      }
//    }
        
//       HasilSemua.items = DataMenu;
//   const level = [];
//   for(const lvl of data.data){
//     if(level.indexOf(lvl.menu_level)==-1){
//       level.push(lvl.menu_level);
//     }
//   }
//   level.sort();
//   const Menjadi = {};
 
//   for(const parent of level){
//     let i=0;
//     for(const semuaMenu of data.data){
//       if(parent==0){
//         Menjadi[parent]={...Menjadi[parent],
          
//                   name: semuaMenu.menu_name,
//                   url: semuaMenu.menu_url,
//                   icon: 'icon-speedometer',
//                   badge: {
//                     variant: 'info',
//                   }
                
                
//         }
//       }
//       if(semuaMenu.parent_origin=='' && semuaMenu.menu_tupe=="parent"){
//         Menjadi[parent]= {...Menjadi[parent],
//           id:semuaMenu.menu_id,
//           name: semuaMenu.menu_name,
//           url: '#2',
//           icon: 'fa fa-user-circle-o',
//           children: ''
//         }
//       }
//       if(semuaMenu.parent_origin!='' && semuaMenu.menu_tupe=="child"){
//           Menjadi[parent]={...Menjadi[parent],
//             id:semuaMenu.menu_id,
//             name: semuaMenu.menu_name,
//             url: '#2',
//             icon: 'fa fa-user-circle-o',
//             children: ''
//           }
//       }
//       if(semuaMenu.parent_origin!='' && semuaMenu.menu_tupe=="child" && parent==level.length+1){
//         Menjadi[parent]={...Menjadi[parent],
//           name: semuaMenu.menu_name,
//           url: '#2',
//           icon: 'fa fa-user-circle-o',
//           children: ''
//         }
//     }
//     i++;
//     }
//   }

    

      return DataMenu;
  } catch (e) {
      return e;
  }    

}



export default getDevices


// export default {
//   items: [
//     {
//       name: 'Dashboard',
//       url: '/dashboard',
//       icon: 'icon-speedometer',
//       badge: {
//         variant: 'info',
//       },
//     },
//     {
//       name: 'Menu',
//       url: '/menu',
//       icon: 'icon-speedometer',
//       badge: {
//         variant: 'info',
//       },
//     },
//     {
//       name: 'User Setting',
//       url: '#2',
//       icon: 'fa fa-user-circle-o',
//       children: [
//         {
//           name: 'User',
//           url: '/usersetting/user',
//         },
//         {
//           name: 'Role',
//           url: '/usersetting/role',
//         },
//         {
//           name: 'Department',
//           url: '/usersetting/depart',
//         },
//         {
//           name: 'Group',
//           url: '/usersetting/group',
//         },
//         {
//           name: 'Branch',
//           url: '/usersetting/branch',
//         },
//       ]
//     },
    
//     {
//       name: 'Reports',
//       url: '/report',
//       icon: 'fa fa-file-o',
//       children: [
//         {
//           name: 'Report A',
//           url: '/report/reportA',
//         },
//         {
//           name: 'Report B',
//           url: '/report/reportB',
//         },
//         {
//           name: 'Report C',
//           url: '/report/reportC',
//         },
        
        
        
//       ]
//     },
//     {
//       name: 'Monitoring',
//       url: '#',
//       icon: 'fa fa-align-justify',
//       children:[]
//     },
   
//     {
//       name: 'Workflow',
//       url: '#2',
//       icon: 'fa fa-key',
//       children:[]
//     },
//     {
//       name: 'Audit Trail',
//       url: '#2',
//       icon: 'fa fa-map-o',
//       children:[]
//     },
//     {
//       name: 'Menu',
//       url: '#2',
//       icon: 'fa fa-key',
//     },
//     {
//       title: true,
//       name: 'Logs',
//       wrapper: {
//         element: '',
//         attributes: {},
//       },
//     },
//     {
//       name: 'User Logs',
//       url: '/theme/typography',
//       icon: 'icon-pencil',
//     },
//     {
//       name: 'Application Logs',
//       url: '/theme/typography',
//       icon: 'icon-pencil',
//     },
//   ],
// };
