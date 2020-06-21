import httpClient from './httpClient'
import { authenticate } from './auth'
import { client as websocketClient } from './websocket'

export function fetchLobbies () {
  return httpClient.get('/lobbies').then(response => response.data)
}

export function createLobby (values) {
  return authenticate()
    .then(() => httpClient.post('/lobbies', values))
    .then(response => response.data)
}

export function fetchLobby (id) {
  return Promise.all([
    httpClient.get(`/lobbies/${id}`).then(response => response.data),
    httpClient.get(`/lobbies/${id}/players`).then(response => response.data)
  ])
    .then(([lobby, players]) => ({
      ...lobby,
      players
    }))

}

export function deleteLobby (id) {
  return httpClient.delete(`/lobbies/${id}`)
}

export function leaveLobby (id) {
  return httpClient.post(`/lobbies/${id}/leave`)
}

export function joinLobby (id) {
  return authenticate()
    .then(() => httpClient.post(`/lobbies/${id}/join`))
}

export function subscribeToJoiningPlayersTopic (lobbyId, callback) {
  const sub = websocketClient.subscribe(`/topic/lobbies/${lobbyId}/joining-players`, message => {
    const newPlayer = JSON.parse(message.body)
    callback(newPlayer)
  })
  return () => {
    sub.unsubscribe()
  }
}

export function subscribeToLeavingPlayersTopic (lobbyId, callback) {
  const sub = websocketClient.subscribe(`/topic/lobbies/${lobbyId}/leaving-players`, message => {
    const playerId = JSON.parse(message.body).playerId
    callback(playerId)
  })
  return () => {
    sub.unsubscribe()
  }
}

export function subscribeToLobbyDeletedTopic (lobbyId, callback) {
  const sub = websocketClient.subscribe(`/topic/lobbies/${lobbyId}/deleted`, () => {
    callback()
  })
  return () => {
    sub.unsubscribe()
  }
}

export function subscribeToGameStartedTopic (lobbyId, callback) {
  const sub = websocketClient.subscribe(`/topic/lobbies/${lobbyId}/game-started`, message => {
    const { gameId } = JSON.parse(message.body)
    callback(gameId)
  })
  return () => {
    sub.unsubscribe()
  }
}

export function fetchLobbiesJoinedByPlayer () {
  return httpClient.get('/lobbies/joined-by-me').then(response => response.data)
}

export function startGame (lobbyId) {
  return httpClient.post(`lobbies/${lobbyId}/start-game`).then(response => response.data)
}
