import axios from 'axios';

export default axios.create({
  baseURL: 'http://18.189.13.6:5000/api/v1/',
  headers: {
    "Cache-Control": 'no-cache'
  }
});