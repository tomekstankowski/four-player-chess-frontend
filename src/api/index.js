import {
  fetchGame,
  fetchGameState,
  fetchPlayersOfTheGame,
  fetchActiveGamesForPlayer,
  makeMove,
  subscribeToMovesTopic,
  resign,
  subscribeToResignationsTopic
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

  fetchLobbies,
  fetchLobby,
  deleteLobby,
  subscribeToLobbyDeletedTopic,
  createLobby,
  leaveLobby,
  subscribeToLeavingPlayersTopic,
  joinLobby,
  subscribeToJoiningPlayersTopic,
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
