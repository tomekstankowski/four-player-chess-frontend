import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'

export default ({ open, onClose }) =>
  <Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    open={open}
    message='An error occurred. Please try again.'
    onClose={onClose}/>
