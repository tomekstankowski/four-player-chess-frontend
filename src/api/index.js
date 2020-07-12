import {
  fetchGame,
  fetchGameState,
  fetchPlayersOfTheGame,
  fetchActiveGamesForPlayer,
  makeMove,
  subscribeToMovesTopic,
  resign,
  subscribeToResignationsTopic,
  claimDraw,
  subscribeToDrawClaimedTopic
} from './game'
import {
  fetchLobbies,
  fetchLobby,
  createLobby,
  deleteLobby,
  subscribeToLobbyDeletedTopic,
  leaveLobby,
  subscribeToLeavingPlayersTopic,
  joinLobby,
  subscribeToJoiningPlayersTopic,
  addBotToLobby,
  subscribeToAddedBotsTopic,
  removeBotFromLobby,
  subscribeToRemovedBotsTopic,
  fetchLobbiesJoinedByPlayer,
  startGame,
  subscribeToGameStartedTopic
} from './lobby'
import { authenticationObservable, getAuthentication } from './auth'
import {
  isConnected as isWebsocketConnected,
  onConnectObservable as onWebsocketConnectObservable,
  onDisconnectObservable as onWebsocketDisconnectObservable,
  init as initWebsocketClient
} from './websocket'

export {
  fetchGame,
  fetchGameState,
  fetchPlayersOfTheGame,
  fetchActiveGamesForPlayer,
  makeMove,
  subscribeToMovesTopic,
  resign,
  subscribeToResignationsTopic,
  claimDraw,
  subscribeToDrawClaimedTopic,

  fetchLobbies,
  fetchLobby,
  deleteLobby,
  subscribeToLobbyDeletedTopic,
  createLobby,
  leaveLobby,
  subscribeToLeavingPlayersTopic,
  joinLobby,
  subscribeToJoiningPlayersTopic,
  addBotToLobby,
  subscribeToAddedBotsTopic,
  removeBotFromLobby,
  subscribeToRemovedBotsTopic,
  fetchLobbiesJoinedByPlayer,
  startGame,
  subscribeToGameStartedTopic,

  getAuthentication,
  authenticationObservable,

  isWebsocketConnected,
  onWebsocketConnectObservable,
  onWebsocketDisconnectObservable,
  initWebsocketClient
}
