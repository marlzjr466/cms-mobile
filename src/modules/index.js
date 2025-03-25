import host from './host'
import home from './home'
import auth from './auth'
import deviceConnection from './device-connection'
import patients from './patients'
import queues from './queues'
import transactions from './transactions'
import statistics from './statistics'
import attendants from './attendants'
import products from './products'

export default () => [
  home(),
  host(),
  auth(),
  deviceConnection(),
  patients(),
  queues(),
  transactions(),
  statistics(),
  attendants(),
  products()
]
