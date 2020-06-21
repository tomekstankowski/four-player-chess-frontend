import httpClient from './httpClient'
import { client as websocketClient } from './websocket'

export function fetchGameState (gameId) {
  return httpClient.get(`/games/${gameId}/state`).then(response => response.data)
}

export function fetchPlayersOfTheGame (gameId) {
  return httpClient.get(`/games/${gameId}/players`).then(response => response.data)
}

export function fetchActiveGamesForPlayer () {
  return httpClient.get('/games/active-for-me').then(response => response.data)
}

export function makeMove (gameId, move) {
  websocketClient.publish({ destination: `/games/${gameId}/moves`, body: JSON.stringify(move) })
}

export function subscribeToMovesTopic (gameId, callback) {
  const sub = websocketClient.subscribe(`/topic/games/${gameId}/moves`, message => {
    const { newGameState, move } = JSON.parse(message.body)
    callback(newGameState, move)
  })
  return () => {
    sub.unsubscribe()
  }
}
