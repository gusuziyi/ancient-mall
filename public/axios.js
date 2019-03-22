import axios from 'axios'

const service = axios.create({
  withCredentials: true // 允许携带cookie
})

export default service