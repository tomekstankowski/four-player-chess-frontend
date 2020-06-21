import React, { useEffect, useState } from 'react'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import LobbyListScreen from 'screens/LobbyListScreen'
import { blue } from '@material-ui/core/colors'
import { Route, Switch } from 'react-router-dom'
import LobbyScreen from 'screens/LobbyScreen'
import { fetchActiveGamesForPlayer, fetchLobbiesJoinedByPlayer, initWebsocketClient } from 'api'
import GameScreen from 'screens/GameScreen'
import Authenticated from 'Authenticated'
import { useAuth } from 'hooks'
import { useHistory } from 'react-router-dom'
import Loader from 'components/Loader'
import { makeStyles } from '@material-ui/core/styles'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[200]
    }
  },
})

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: '#2B2B2B',
    display: 'flex',
    justifyContent: 'center'
  },
  loaderContainer: {
    alignSelf: 'center'
  }
})

function App () {
  const [isInitializing, setInitializing] = useState(true)
  const auth = useAuth()
  const history = useHistory()
  const classes = useStyles()

  useEffect(() => {
    initWebsocketClient()
  }, [])

  useEffect(() => {
    if (auth && isInitializing) {
      Promise.all([
        fetchLobbiesJoinedByPlayer(),
        fetchActiveGamesForPlayer()
      ])
        .then(res => {
          const lobbies = res[0]
          const games = res[1]
          if (games.length > 0) {
            history.replace(`/game/${games[0].id}`)
          } else if (lobbies.length > 0) {
            history.replace(`/lobby/${lobbies[0].id}`)
          }
        })
        .catch(() => {})
        .then(() => setInitializing(false))
    } else if (isInitializing) {
      setInitializing(false)
    }
  }, [auth, history, isInitializing])

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        {
          isInitializing
            ? (
              <div className={classes.loaderContainer}>
                <Loader/>
              </div>
            )
            : (
              <Switch>

                <Route path='/lobby/:id'>
                  <Authenticated>
                    {auth => <LobbyScreen auth={auth}/>}
                  </Authenticated>
                </Route>

                <Route path='/game/:id'>
                  <Authenticated>
                    {auth => <GameScreen auth={auth}/>}
                  </Authenticated>
                </Route>

                <Route path='/'>
                  <LobbyListScreen/>
                </Route>

              </Switch>
            )
        }
      </div>
    </ThemeProvider>
  )
}

export default App
