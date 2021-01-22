import React from 'react'
import {useSelector} from 'react-redux';
import API from './api/api';

const [getMenu, setGetMenu] = React.useState([]);
const data = useSelector(state=>state.accessUser);
let token = localStorage.getItem('id_token');
API.post("/credential_service/get_menu", {
    key: token,
   
    info_data: "all"
  }).then(data => {
        setGetMenu(data.data.data)
    }) 

export default getMenu;