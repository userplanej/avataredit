import axios from 'axios';

export default axios.create({
  baseURL: 'http://18.117.136.162:5000/api/v1/'
});