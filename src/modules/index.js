import host from './host'
import auth from './auth'
import deviceConnection from './device-connection'

export default () => [
  host(),
  auth(),
  deviceConnection()
]
