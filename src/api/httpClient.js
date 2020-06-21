import * as axios from 'axios'
import { getAuthTokenFromLocalStorage, removeAuthTokenFromLocalStorage } from 'api/authTokenStorage'

const httpClient = axios.create({
  baseURL: 'http://localhost:8080'
})

httpClient.interceptors.request.use(config => {
  const authToken = getAuthTokenFromLocalStorage()
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`
  }
  return config
}, error => {
  if (error.response && error.response.status === 401) {
    removeAuthTokenFromLocalStorage()
  }
  return Promise.reject(error)
})

export default httpClient
