import axios from 'axios';
// import {useSelector, useDispatch} from 'react-redux';

const data = "http://34.101.137.61:22112/credential_service";

const data1 = "http://localhost:5450/credential_service" 
// const dataapi = useSelector(state=>state.dataapi)
export default axios.create({
  baseURL: data
});