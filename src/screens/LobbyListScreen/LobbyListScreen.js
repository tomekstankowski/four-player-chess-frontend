import React, { useEffect, useState } from 'react'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import { fetchLobbies, joinLobby } from 'api'
import moment from 'moment'
import CreateLobbyDialog from 'screens/LobbyListScreen/CreateLobbyDialog'
import { useHistory } from 'react-router-dom'
import ErrorSnackbar from 'components/ErrorSnackbar'
import { makeStyles } from '@material-ui/core/styles'

function formatDateTime (dateTimeStr) {
  return moment(dateTimeStr).format('HH:mm DD-MM-YYYY')
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 24
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableContainer: {
    marginTop: 32
  },
  table: {
    minWidth: 650
  }
})

export default function LobbyListScreen () {
  const [lobbies, setLobbies] = useState({
    isLoading: true,
    isError: false,
    value: []
  })
  const [isError, setError] = useState(false)
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)

  const classes = useStyles()

  const history = useHistory()

  function handleCreateClick () {
    setCreateDialogOpen(true)
  }

  function navigateToLobbyScreen (lobby) {
    history.replace(`/lobby/${lobby.id}`)
  }

  function handleCreateDialogClose (newLobby) {
    setCreateDialogOpen(false)
    if (newLobby) {
      const listItem = {
        ...newLobby,
        numberOfPlayers: 1
      }
      setLobbies({
        ...lobbies,
        value: [listItem, ...lobbies.value]
      })
      navigateToLobbyScreen(newLobby)
    }
  }

  useEffect(() => {
    fetchLobbies()
      .then(lobbies => setLobbies({
        isLoading: false,
        isError: false,
        value: lobbies
      }))
      .catch(() => setLobbies({
        isLoading: false,
        isError: true,
        value: []
      }))
  }, [])

  function handleJoinClick (lobby) {
    joinLobby(lobby.id)
      .then(() => navigateToLobbyScreen(lobby))
      .catch(() => setError(true))
  }

  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <Typography
          variant='h2'
          color='textPrimary'>
          Lobbies
        </Typography>
        <Button
          onClick={handleCreateClick}
          variant='contained'
          color='primary'
          endIcon={<AddIcon/>}
          disableElevation>
          Create
        </Button>
      </div>
      <TableContainer
        component={Paper}
        className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell>Players</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              lobbies.value.map(lobby =>
                (
                  <TableRow key={lobby.id}>
                    <TableCell>{lobby.name}</TableCell>
                    <TableCell>{formatDateTime(lobby.createdAt)}</TableCell>
                    <TableCell>{lobby.numberOfPlayers}/4</TableCell>
                    <TableCell>
                      <Button
                        disabled={lobby.numberOfPlayers === 4}
                        onClick={() => handleJoinClick(lobby)}>
                        Join
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
      <CreateLobbyDialog
        open={isCreateDialogOpen}
        onClose={handleCreateDialogClose}/>
      <ErrorSnackbar
        open={isError}
        onClose={() => setError(false)}/>
    </div>
  )
}
