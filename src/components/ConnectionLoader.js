import React from 'react'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progress: {
    marginLeft: 8
  }
})

export default () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography variant='h6' color='textPrimary'>Connecting</Typography>
      <CircularProgress className={classes.progress}/>
    </div>
  )
}

