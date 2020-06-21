import { useHistory } from 'react-router-dom'
import { useAuth } from 'hooks'

export default ({ children }) => {
  const auth = useAuth()
  const history = useHistory()
  if (auth) {
    return children(auth)
  }
  history.replace('/')
  return null
}
