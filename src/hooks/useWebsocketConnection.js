import { useEffect, useState } from 'react'
import { onWebsocketConnectObservable, onWebsocketDisconnectObservable, isWebsocketConnected } from 'api'

export default () => {
  const [isConnected, setConnected] = useState(isWebsocketConnected())

  useEffect(() => {
    const onConnectSub = onWebsocketConnectObservable.subscribe(() => setConnected(true))
    const onDisconnectSub = onWebsocketDisconnectObservable.subscribe(() => setConnected(false))
    setConnected(isWebsocketConnected())

    return () => {
      onConnectSub.unsubscribe()
      onDisconnectSub.unsubscribe()
    }
  }, [])

  return isConnected
}
