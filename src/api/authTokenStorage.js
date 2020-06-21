import { BehaviorSubject } from 'rxjs'

const tokenKey = 'authToken'

export function getAuthTokenFromLocalStorage () {
  return localStorage.getItem(tokenKey)
}

export function saveAuthTokenInLocalStorage (token) {
  localStorage.setItem(tokenKey, token)
  authTokenSubject.next(token)
}

export function removeAuthTokenFromLocalStorage () {
  localStorage.removeItem(tokenKey)
  authTokenSubject.next(null)
}

const currentToken = getAuthTokenFromLocalStorage()
const authTokenSubject = new BehaviorSubject(currentToken)

export const authTokenObservable = authTokenSubject.asObservable()
