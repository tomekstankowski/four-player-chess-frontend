import { Client } from '@stomp/stompjs'
import { Subject } from 'rxjs'
import { authTokenObservable } from './authTokenStorage'

const onConnectTopic = new Subject()
export const onConnectObservable = onConnectTopic.asObservable()

const onDisconnectTopic = new Subject()
export const onDisconnectObservable = onDisconnectTopic.asObservable()

export const client = new Client({
  brokerURL: 'ws://localhost:8080/socket/websocket',
  debug: msg => console.log(msg),
  onConnect: receipt => onConnectTopic.next(receipt),
  onWebSocketClose: evt => onDisconnectTopic.next(evt)
})

export function isConnected () {
  return client.connected
}

export function init () {
  authTokenObservable.subscribe(token => {
    if (token) {
      client.connectHeaders = {
        Authorization: `Bearer ${token}`
      }
      client.activate()
    } else {
      client.deactivate()
    }
  })

}

