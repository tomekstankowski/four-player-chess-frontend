import { mapFetched } from 'resource'

export function addPlayer (lobbyRes, newPlayer) {
  return mapFetched(lobbyRes, value => ({
    ...value,
    players: [...value.players, newPlayer]
  }))
}

export function removeHumanPlayer (lobbyRes, playerId) {
  return mapFetched(lobbyRes, value => ({
    ...value,
    players: value.players.filter(p => p.userId !== playerId)
  }))
}

export function removeBotPlayer (lobbyRes, botId) {
  return mapFetched(lobbyRes, value => ({
    ...value,
    players: value.players.filter(p => p.botId !== botId)
  }))
}
