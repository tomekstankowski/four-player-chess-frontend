import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LobbyPlayerType from 'screens/LobbyScreen/LobbyPlayerType'
import List from '@material-ui/core/List'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(theme => ({
  space: {
    height: 16
  },
  root: {
    borderRadius: 8,
    minHeight: 64,
    minWidth: 320,
    backgroundColor: theme.palette.background.paper
  },
}))

function getListItemKey (lobbyPlayer) {
  if (lobbyPlayer.type === 'randomBot') {
    return lobbyPlayer.botId
  }
  if (lobbyPlayer.type === 'human') {
    return lobbyPlayer.userId
  }
  return null
}

function getListItemTitle (lobbyPlayer, lobby, auth) {
  if (lobbyPlayer.type === LobbyPlayerType.RandomBot) {
    return 'Random bot'
  }
  let title = lobbyPlayer.userId === auth.userId ? 'You' : 'Unknown player'
  if (lobbyPlayer.userId === lobby.ownerId) {
    title += ' (lobby owner)'
  }
  return title
}

function LobbyListItem ({ lobbyPlayer, lobby, auth, onDeleteClick }) {
  const classes = useStyles()
  const title = getListItemTitle(lobbyPlayer, lobby, auth)
  const isBot = lobbyPlayer.type === LobbyPlayerType.RandomBot

  return (
    <div>
      <ListItem classes={{
        root: classes.root
      }}>
        <ListItemText
          primary={<Typography variant='body1' color='textPrimary'>{title}</Typography>}/>
        {
          isBot &&
          <IconButton
            onClick={onDeleteClick}>
            <ClearIcon/>
          </IconButton>
        }
      </ListItem>
      <div className={classes.space}/>
    </div>
  )
}

export default function ({ lobby, auth, onDeleteClick }) {
  return (
    <List>
      {
        lobby.players.map(lobbyPlayer =>
          <LobbyListItem
            key={getListItemKey(lobbyPlayer)}
            auth={auth}
            lobby={lobby}
            lobbyPlayer={lobbyPlayer}
            onDeleteClick={() => onDeleteClick(lobbyPlayer)}/>
        )
      }
    </List>
  )
}
