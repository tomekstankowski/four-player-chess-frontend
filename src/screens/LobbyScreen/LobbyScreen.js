import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import {
  addBotToLobby,
  deleteLobby,
  fetchLobby,
  leaveLobby,
  removeBotFromLobby,
  startGame,
  subscribeToAddedBotsTopic,
  subscribeToGameStartedTopic,
  subscribeToJoiningPlayersTopic,
  subscribeToLeavingPlayersTopic,
  subscribeToLobbyDeletedTopic,
  subscribeToRemovedBotsTopic
} from 'api'
import { fetched, fetchError, loading } from 'resource'
import { useHistory, useParams } from 'react-router-dom'
import { useWebsocketConnection } from 'hooks'
import Loader from 'components/Loader'
import ErrorMessage from 'components/ErrorMessage'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import ButtonLoader from 'components/ButtonLoader'
import ErrorSnackbar from 'components/ErrorSnackbar'
import ConnectionLoader from 'components/ConnectionLoader'
import LobbyPlayersList from 'screens/LobbyScreen/LobbyPlayersList'
import { addPlayer, removeBotPlayer, removeHumanPlayer } from 'screens/LobbyScreen/utils'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  space: {
    height: 32
  },
  smallSpace: {
    height: 16
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  fillRemainingSpace: {
    flexGrow: 1
  }
}))

export default function LobbyScreen ({ auth }) {
  const [lobby, setLobby] = useState(loading())

  const [isDeleteInProgress, setDeleteInProgress] = useState(false)
  const [isLeaveInProgress, setLeaveInProgress] = useState(false)
  const [isStartInProgress, setStartInProgress] = useState(false)
  const [isAddBotInProgress, setAddBotInProgress] = useState(false)
  const isActionInProgress = isDeleteInProgress || isLeaveInProgress || isStartInProgress

  const [isActionError, setActionError] = useState(false)

  const { id: lobbyId } = useParams()

  const history = useHistory()
  const { userId: currentUserId } = auth

  const isConnected = useWebsocketConnection()

  useEffect(() => {
    fetchLobby(lobbyId)
      .then(lobby => setLobby(fetched(lobby)))
      .catch(() => setLobby(fetchError()))
  }, [lobbyId])

  useEffect(() => {
    if (!isConnected) {
      return () => {}
    }
    const unsubscribeFromJoiningPlayersTopic = subscribeToJoiningPlayersTopic(lobbyId, newPlayer => {
      setLobby(lobby => addPlayer(lobby, newPlayer))
    })

    const unsubscribeFromLeavingPlayersTopic = subscribeToLeavingPlayersTopic(lobbyId, playerId => {
      setLobby(lobby => removeHumanPlayer(lobby, playerId))
    })

    const unsubscribeFromAddedBotsTopic = subscribeToAddedBotsTopic(lobbyId, newPlayer => {
      setLobby(lobby => addPlayer(lobby, newPlayer))
    })

    const unsubscribeFromRemovedBotsTopic = subscribeToRemovedBotsTopic(lobbyId, botId => {
      setLobby(lobby => removeBotPlayer(lobby, botId))
    })

    const unsubscribeFromLobbyDeleteTopic = subscribeToLobbyDeletedTopic(lobbyId, () => {
      history.replace('/')
    })

    const unsubscribeFromGameStartTopic = subscribeToGameStartedTopic(lobbyId, gameId => {
      history.replace(`/game/${gameId}`)
    })

    return () => {
      unsubscribeFromJoiningPlayersTopic()
      unsubscribeFromLeavingPlayersTopic()
      unsubscribeFromAddedBotsTopic()
      unsubscribeFromRemovedBotsTopic()
      unsubscribeFromLobbyDeleteTopic()
      unsubscribeFromGameStartTopic()
    }
  }, [lobbyId, isConnected, history])

  function handleDeleteClick () {
    setDeleteInProgress(true)
    deleteLobby(lobbyId)
      .then(() => history.replace('/'))
      .catch(() => {
        setActionError(true)
        setDeleteInProgress(false)
      })
  }

  function handleLeaveClick () {
    setLeaveInProgress(true)
    leaveLobby(lobbyId)
      .then(() => history.replace('/'))
      .catch(() => {
        setActionError(true)
        setLeaveInProgress(false)
      })
  }

  function handleStartClick () {
    setStartInProgress(true)
    startGame(lobbyId)
      .then(game => history.replace(`/game/${game.id}`))
      .catch(() => {
        setActionError(true)
        setStartInProgress(false)
      })
  }

  function handleAddBotClick () {
    setAddBotInProgress(true)
    addBotToLobby(lobbyId)
      .catch(() => {
        setActionError(true)
      })
      .then(() => {
        setAddBotInProgress(false)
      })
  }

  function handleRemoveBotClick (botPlayer) {
    removeBotFromLobby(lobbyId, botPlayer.botId)
      .catch(() => {
        setActionError(true)
      })
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      {lobby.isLoading && <Loader/>}
      {lobby.isError && <ErrorMessage/>}
      {
        lobby.value &&
        <>
          <Typography
            variant='h4'
            color='textSecondary'>
            Lobby <Typography variant='h2' color='textPrimary' component='span'>{lobby.value.name}</Typography>
          </Typography>
          <div className={classes.space}/>
          <div className={classes.content}>
            <Typography
              variant='h4'
              color='textSecondary'>
              Players
            </Typography>
            <LobbyPlayersList
              lobby={lobby.value}
              auth={auth}
              onDeleteClick={handleRemoveBotClick}
            />
            {
              lobby.value.ownerId === currentUserId &&
              <Button
                disabled={lobby.value.players.length === 4 || isActionInProgress}
                onClick={handleAddBotClick}
                variant='outlined'
                startIcon={<AddIcon/>}>
                Add bot
                <ButtonLoader isVisible={isAddBotInProgress}/>
              </Button>
            }
            <div className={classes.space}/>
            {
              lobby.value.ownerId === currentUserId &&
              <>
                <Button
                  disabled={lobby.value.players.length < 4 || isActionInProgress}
                  onClick={handleStartClick}
                  variant='contained'
                  color='primary'>
                  Start game
                  <ButtonLoader isVisible={isStartInProgress}/>
                </Button>
                <div className={classes.smallSpace}/>
                <Button
                  disabled={isActionInProgress}
                  onClick={handleDeleteClick}
                  variant='contained'
                  color='secondary'>
                  Delete lobby
                  <ButtonLoader isVisible={isDeleteInProgress}/>
                </Button>
              </>
            }
            {
              lobby.value.ownerId !== currentUserId &&
              <Button
                disabled={isActionInProgress}
                onClick={handleLeaveClick}
                variant='contained'
                color='secondary'>
                Leave lobby
                <ButtonLoader isVisible={isLeaveInProgress}/>
              </Button>
            }
            {
              !isConnected &&
              <>
                <div className={classes.space}/>
                <ConnectionLoader/>
              </>
            }
          </div>
        </>
      }
      <ErrorSnackbar
        open={isActionError}
        onClose={() => setActionError(false)}/>
    </div>
  )
}
