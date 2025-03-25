import { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as ScreenOrientation from 'expo-screen-orientation'

// assets
import styles from '@assets/style'

// provider
import AuthProvider from '@providers/auth-provider'
import ModalProvider from '@providers/modal-provider'
import DeviceProvider from '@providers/device-provider'

// utilities
import socket from '@utilities/socket'

// hooks
import { useStorage, useToast, useMeta, useAuth } from '@hooks'

// stack
import stacks from '@stacks'
const Stack = createNativeStackNavigator()

const screenOptions = { 
  headerShown: false, 
  animation: 'slide_from_right' 
}

function Main ({ navigation }) {
  const toast = useToast()
  const storage = useStorage()
  const { auth } = useAuth()
  const { metaStates, metaMutations } = useMeta()

  const host = {
    ...metaStates('host', ['address']),
    ...metaMutations('host', ['SET_ADDRESS'])
  }

  const [orientation, setOrientation] = useState('')

  useEffect(() => {
    // Unlock screen orientation to allow auto rotation
    // ScreenOrientation.unlockAsync()

    // Listen for orientation changes
    // const subscribe = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
    //   setOrientation(ScreenOrientation.Orientation[orientationInfo.orientation])
    // })

    // return () => {
    //   ScreenOrientation.removeOrientationChangeListener(subscribe)
    // }
  }, [])

  useEffect(() => {
    if (host.address) {
      socket.connect(host.address)
      storage.set('api-host', host.address)
      toast.show('API host address setup complete!')

      setTimeout(() => goto({ child: 'auth' }), 1000)
    }
  }, [host.address])

  useEffect(() => {
    async function init () {
      const host = await storage.get('api-host')

      goto({
        parent: 'root',
        child: host
          ? 'auth'
          : 'setup-host'
          // : 'test'
      })
    }

    if (auth) {
      goto({ child: 'dashboard' })
    } else {
      init()
    }
  }, [auth])

  const goto = ({ parent = 'root', child, params }) => {
    navigation.navigate(
      parent, 
      { 
        screen: child,
        params: params ? params : null
      }
    )
	}

	return (
    <>
      <Stack.Navigator screenOptions={ screenOptions }>
        {
          stacks()
            .map((stack, key) => {
              return <Stack.Screen
                key = { key }
                name = { stack.name }
                options = { stack.options }
              >
                {(props) => (
                  <stack.component 
                    goto = { goto }
                    styles = { styles }
                    childStacks = { stack.children ? stack.children : [] }
                    { ...props }
                  />
                )}
              </Stack.Screen>
          })
        }
      </Stack.Navigator>
    </>
	)
}

export default function Index ({ navigation }) {
  return (
    <AuthProvider>
      <DeviceProvider>
        <ModalProvider>
          <Main navigation={navigation} />
        </ModalProvider>
      </DeviceProvider>
    </AuthProvider>
  )
}
