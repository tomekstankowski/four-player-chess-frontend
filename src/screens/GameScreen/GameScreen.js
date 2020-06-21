import React, { useCallback, useEffect, useState } from 'react'
import ChessBoard from 'components/ChessBoard'
import { fetchGameState, fetchPlayersOfTheGame, makeMove, subscribeToMovesTopic } from 'api'
import Button from '@material-ui/core/Button'
import FlipIcon from '@material-ui/icons/RotateLeftRounded'
import Typography from '@material-ui/core/Typography'
import { useParams } from 'react-router-dom'
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
  const [players, setPlayers] = useState(loading())
  const [lastMove, setLastMove] = useState(null)
  const [observedColor, setObservedColor] = useState(PieceColor.Red)

  const isConnected = useWebsocketConnection()

  const classes = useStyles()

  const { id: gameId } = useParams()

  const { userId: currentUserId } = auth

  const loadGameState = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isError: false,
      isLoading: true
    }))

    fetchGameState(gameId)
      .then(gameState => setGameState(fetched(gameState)))
      .catch(() =>
        setGameState(prev => ({
            ...prev,
            isError: true,
            isLoading: false,
          })
        )
      )
  }, [gameId])

  const getColorOfCurrentPlayer = useCallback(players => {
    const player = players.find(p => p.playerId === currentUserId)
    return player.color
  }, [currentUserId])

  function handleFlipClick () {
    const observedColorIndex = Object.values(PieceColor).indexOf(observedColor)
    const newObservedColorIndex = (observedColorIndex + 1) % Object.values(PieceColor).length
    const newObservedColor = Object.values(PieceColor)[newObservedColorIndex]
    setObservedColor(newObservedColor)
  }

  function handleMove (move) {
    makeMove(gameId, move)
  }

  useEffect(() => {
    if (!isConnected) {
      return () => {}
    }
    loadGameState()
    const unsubscribeFromMovesTopic = subscribeToMovesTopic(gameId, (newGameState, move) => {
      setLastMove(move)
      setGameState(fetched(newGameState))
    })

    return () => {
      unsubscribeFromMovesTopic()
    }
  }, [gameId, loadGameState, isConnected])

  useEffect(() => {
    setPlayers(loading())

    fetchPlayersOfTheGame(gameId)
      .then(players => {
        setPlayers(fetched(players))
        const currentPlayerColor = getColorOfCurrentPlayer(players)
        setObservedColor(currentPlayerColor)
      })
      .catch(() => setPlayers(fetchError()))
  }, [gameId, getColorOfCurrentPlayer])

  return (
    <div className={classes.container}>
      <div className={classes.boardContainer}>
        {
          gameState.isError &&
          <Typography
            color='error'
            variant='h4'>
            An error occurred, please refresh browser
          </Typography>
        }
        {
          gameState.isLoading && !gameState.value &&
          <ChessBoard
            board={emptyBoard}/>
        }
        {
          gameState.value && !gameState.isError &&
          <ChessBoard
            board={gameState.value.board}
            nextMoveColor={gameState.value.nextMoveColor}
            isPlayerMove={players.value && getColorOfCurrentPlayer(players.value) === gameState.value.nextMoveColor}
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
            gameState.value &&
            <>
              <Typography color='textPrimary' variant='h6'>
                Next turn: <Typography className={classes[gameState.value.nextMoveColor]} component='span'
                                       variant='h6'>{gameState.value.nextMoveColor.toUpperCase()}</Typography>
              </Typography>
              <div className={classes.space}/>
              <Button
                onClick={handleFlipClick}
                startIcon={<FlipIcon/>}>
                Flip board
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
