import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  hidden: {
    visibility: 'hidden'
  }
})

export default function ({ isVisible }) {
  const classes = useStyles()

  return (
    <CircularProgress
      className={isVisible ? null : classes.hidden}
      size={24}
    />
  )
}
