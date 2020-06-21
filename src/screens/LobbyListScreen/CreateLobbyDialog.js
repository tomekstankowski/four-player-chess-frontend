import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { createLobby } from 'api'
import ErrorSnackbar from 'components/ErrorSnackbar'
import ButtonLoader from 'components/ButtonLoader'

export default function CreateLobbyDialog ({ open, onClose }) {
  const [name, setName] = useState('')
  const [isCreateInProgress, setCreateInProgress] = useState(false)
  const [isCreateError, setCreateError] = useState(false)
  const isNameValid = name && name.length >= 5
  const isFormValid = isNameValid

  function handleNameChange (event) {
    const val = event.target.value
    setName(val)
  }

  function handleDismiss () {
    onClose(null)
    resetState()
  }

  function handleErrorDismiss () {
    setCreateError(false)
  }

  function resetState () {
    setName('')
    setCreateInProgress(false)
    setCreateError(false)
  }

  function handleCreateClick () {
    setCreateInProgress(true)
    createLobby({
      name: name
    })
      .then(lobby => {
        resetState()
        onClose(lobby)
      })
      .catch(() => setCreateError(true))
      .then(() => setCreateInProgress(false))
  }

  return (
    <Dialog
      open={open}
      onClose={handleDismiss}>
      <DialogTitle>Create new lobby</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Name"
          error={!isNameValid}
          helperText={isNameValid ? ' ' : 'At least 5 characters'}
          value={name}
          onChange={handleNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDismiss}
          color='primary'>
          Cancel
        </Button>
        <Button
          disabled={!isFormValid}
          onClick={handleCreateClick}
          color='primary'>
          Create
          <ButtonLoader isVisible={isCreateInProgress}/>
        </Button>
      </DialogActions>
      <ErrorSnackbar
        open={isCreateError}
        onClose={handleErrorDismiss}/>
    </Dialog>
  )
}
