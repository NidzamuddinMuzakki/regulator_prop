import axios from 'axios';
// import {useSelector, useDispatch} from 'react-redux';

const data = "http://34.101.137.236:8080/";
const data1 = "http://localhost:5450/"
// const dataapi = useSelector(state=>state.dataapi)
export default axios.create({
  baseURL: data
});