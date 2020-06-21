import httpClient from './httpClient'
import {
  authTokenObservable,
  getAuthTokenFromLocalStorage,
  removeAuthTokenFromLocalStorage,
  saveAuthTokenInLocalStorage
} from './authTokenStorage'
import { map } from 'rxjs/operators'
import decodeJwt from 'jwt-decode'

export function authenticate () {
  return httpClient.post('/token')
    .then(response => response.data.token)
    .then(token => saveAuthTokenInLocalStorage(token))
}

export function clearAuthentication () {
  removeAuthTokenFromLocalStorage()
}

function toAuth (token) {
  const decodedToken = decodeJwt(token)
  return ({
    userId: decodedToken.sub
  })
}

export const authenticationObservable = authTokenObservable.pipe(
  map(token => {
    if (token) {
      return toAuth(token)
    } else {
      return null
    }
  })
)

export function getAuthentication () {
  const token = getAuthTokenFromLocalStorage()
  if (token) {
    return toAuth(token)
  }
  return null
}
