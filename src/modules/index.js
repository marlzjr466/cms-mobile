import host from './host'
import auth from './auth'
import deviceConnection from './device-connection'
import patients from './patients'
import queues from './queues'
import transactions from './transactions'
import statistics from './statistics'
import attendants from './attendants'

export default () => [
  host(),
  auth(),
  deviceConnection(),
  patients(),
  queues(),
  transactions(),
  statistics(),
  attendants()
]
