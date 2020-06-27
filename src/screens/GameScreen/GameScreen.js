import React, { useCallback, useEffect, useState } from 'react'
import ChessBoard from 'components/ChessBoard'
import {
  fetchGame,
  fetchGameState,
  fetchPlayersOfTheGame,
  makeMove,
  resign,
  subscribeToMovesTopic,
  subscribeToResignationsTopic
} from 'api'
import Button from '@material-ui/core/Button'
import FlipIcon from '@material-ui/icons/RotateLeftRounded'
import Typography from '@material-ui/core/Typography'
import { useHistory, useParams } from 'react-router-dom'
import { fetched, fetchError, loading } from 'resource'
import { useWebsocketConnection } from 'hooks'
import ConnectionLoader from 'components/ConnectionLoader'
import { makeStyles } from '@material-ui/core/styles'

const PieceColor = {
  Red: 'red',
  Blue: 'blue',
  Yellow: 'yellow',
  Green: 'green'
}

const emptyBoard = [
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '']
]

const useStyles = makeStyles({
  container: {
    flexGrow: 1,

    display: 'flex',
    justifyContent: 'space-between'
  },
  panel: {
    backgroundColor: '#3C3F41',
    width: 400,
    display: 'flex'
  },
  panelContentContainer: {
    flexGrow: 1,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16
  },
  boardContainer: {
    flexGrow: 1,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  space: {
    height: 16
  },
  fillRemainingSpace: {
    flexGrow: 1
  },
  red: {
    color: '#E50318'
  },
  blue: {
    color: '#1285B9'
  },
  yellow: {
    color: '#FFDC38'
  },
  green: {
    color: '#00C929'
  }
})

export default function GameScreen ({ auth }) {
  const [gameState, setGameState] = useState(loading())
  const [game, setGame] = useState(loading())
  const [lastMove, setLastMove] = useState(null)
  const [observedColor, setObservedColor] = useState(PieceColor.Red)

  const isConnected = useWebsocketConnection()

  const classes = useStyles()

  const { id: gameId } = useParams()

  const { userId: currentUserId } = auth

  const history = useHistory()

  useEffect(() => {
    Promise.all([
      fetchGame(gameId),
      fetchPlayersOfTheGame(gameId)
    ])
      .then(([game, players]) =>
        setGame(
          fetched({
            ...game,
            players: players
          })
        )
      )
      .catch(() =>
        setGame(fetchError())
      )
  }, [gameId])

  const loadGameState = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isError: false,
      isLoading: true
    }))

    fetchGameState(gameId)
      .then(gameState => setGameState(fetched(gameState)))
      .catch(() => setGameState(fetchError())
      )
  }, [gameId])

  const getColorOfCurrentUser = players => {
    const player = players.find(p => p.playerId === currentUserId)
    if (player) {
      return player.color
    }
    return null
  }

  const colorOfCurrentUser = game.value ? getColorOfCurrentUser(game.value.players) : null

  function handleFlipClick () {
    const observedColorIndex = Object.values(PieceColor).indexOf(observedColor)
    const newObservedColorIndex = (observedColorIndex + 1) % Object.values(PieceColor).length
    const newObservedColor = Object.values(PieceColor)[newObservedColorIndex]
    setObservedColor(newObservedColor)
  }

  function handleMove (move) {
    makeMove(gameId, move)
  }

  function handleResignClick () {
    resign(gameId)
  }

  function handleNewGameClick () {
    history.replace('/')
  }

  useEffect(() => {
    if (!isConnected || !game.value || game.value.isCancelled || game.value.isFinished) {
      return () => {}
    }
    loadGameState()
    const unsubscribeFromMovesTopic = subscribeToMovesTopic(gameId, (newGameState, move) => {
      setLastMove(move)
      setGameState(fetched(newGameState))
    })

    const unsubscribeFromResignationsTopic = subscribeToResignationsTopic(gameId, (newGameState, resignedColor) => {
      setGameState(fetched(newGameState))
    })

    return () => {
      unsubscribeFromMovesTopic()
      unsubscribeFromResignationsTopic()
    }
  }, [gameId, game, loadGameState, isConnected])

  useEffect(() => {
    if (colorOfCurrentUser) {
      setObservedColor(colorOfCurrentUser)
    }
  }, [colorOfCurrentUser])

  function isResignationAllowed () {
    const state = gameState.value
    return state && !state.isFinished && colorOfCurrentUser && !state.eliminatedColors.includes(colorOfCurrentUser)
  }

  function isNewGameAllowed () {
    const stateVal = gameState.value
    const gameVal = game.value
    return (stateVal && (stateVal.isFinished || stateVal.eliminatedColors.includes(colorOfCurrentUser)))
      || (gameVal && (gameVal.isFinished || gameVal.isCancelled))
      || !colorOfCurrentUser
  }

  return (
    <div className={classes.container}>
      <div className={classes.boardContainer}>
        {
          (game.isError || gameState.isError) &&
          <Typography
            color='error'
            variant='h4'>
            An error occurred, please refresh browser
          </Typography>
        }
        {
          (!game.isError && gameState.isLoading && !gameState.value) &&
          <ChessBoard
            board={emptyBoard}/>
        }
        {
          (game.value && gameState.value) &&
          <ChessBoard
            board={gameState.value.board}
            nextMoveColor={gameState.value.nextMoveColor}
            isPlayerMove={!gameState.value.isFinished && colorOfCurrentUser === gameState.value.nextMoveColor}
            legalMoves={gameState.value.legalMoves}
            eliminatedColors={gameState.value.eliminatedColors}
            colorsInCheck={gameState.value.colorsInCheck}
            observedColor={observedColor}
            onMove={handleMove}
            lastMove={lastMove}
          />
        }
      </div>
      <div className={classes.panel}>
        <div className={classes.panelContentContainer}>
          {
            (gameState.value && colorOfCurrentUser) &&
            <Typography color='textPrimary' variant='h6'>
              You play as <Typography className={classes[colorOfCurrentUser]}
                                      component='span'
                                      variant='h6'>{colorOfCurrentUser}</Typography>
            </Typography>
          }
          {
            (gameState.value && !gameState.value.isFinished) &&
            <>
              <div className={classes.space}/>
              <Typography color='textPrimary' variant='h6'>
                Next move: <Typography className={classes[gameState.value.nextMoveColor]} component='span'
                                       variant='h6'>{gameState.value.nextMoveColor}</Typography>
              </Typography>
              <div className={classes.space}/>
              <Button
                onClick={handleFlipClick}
                startIcon={<FlipIcon/>}>
                Flip board
              </Button>
            </>
          }
          {
            isResignationAllowed() &&
            <Button
              color='secondary'
              onClick={handleResignClick}>
              Resign
            </Button>
          }
          {
            (game.value && game.value.isFinished) &&
            <Typography
              color='textPrimary'
              variant='h6'>
              Game over
            </Typography>
          }
          {
            (game.value && game.value.isCancelled) &&
            <Typography
              color='textPrimary'
              variant='h6'>
              Game cancelled
            </Typography>
          }
          {
            (gameState.value && gameState.value.isFinished && gameState.value.winningColor) &&
            <Typography
              className={classes[gameState.value.winningColor]}
              color='textPrimary'
              variant='h6'>
              {gameState.value.winningColor}
              <Typography
                component='span'
                color='textPrimary'
                variant='h6'> won
              </Typography>
            </Typography>
          }
          {
            (gameState.value && gameState.value.isFinished && !gameState.value.winningColor) &&
            <Typography
              color='textPrimary'
              variant='h6'>
              Draw
            </Typography>
          }
          {
            isNewGameAllowed() &&
            <>
              <div className={classes.space}/>
              <Button
                color='primary'
                onClick={handleNewGameClick}>
                New game
              </Button>
            </>
          }
          <div className={classes.fillRemainingSpace}/>
          {
            !isConnected &&
            <>
              <ConnectionLoader/>
              <div className={classes.space}/>
            </>
          }
        </div>
      </div>
    </div>)
}
