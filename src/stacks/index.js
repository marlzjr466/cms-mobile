import auth from '@screens/auth'
import setupHost from '@screens/setup-host'
import dashboard from '@screens/dashboard'

import home from '@screens/home'
import patients from '@screens/patients'
import transactions from '@screens/transactions'
import settings from '@screens/settings'

const options = { headerShown: false }
export default () => [
  {
    name: 'auth',
    component: auth,
    options: options
  },
  {
    name: 'setup-host',
    component: setupHost,
    options: options
  },
  {
    name: 'dashboard',
    component: dashboard,
    options: options,
    children: [
      {
        name: 'home',
        component: home,
        options: options,
      },
      {
        name: 'patients',
        component: patients,
        options: options,
      },
      {
        name: 'transactions',
        component: transactions,
        options: options,
      },
      {
        name: 'settings',
        component: settings,
        options: options,
      }
    ]
  }
]