import { useEffect, useState } from 'react'
import { authenticationObservable, getAuthentication } from 'api'

export default function useAuth () {
  const [auth, setAuth] = useState(getAuthentication())

  useEffect(() => {
    const subscription = authenticationObservable.subscribe(setAuth)
    return () => subscription.unsubscribe()
  }, [])

  return auth
}
