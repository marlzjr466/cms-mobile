import { useEffect, memo } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, BackHandler, Dimensions } from 'react-native'
import { ReduxMeta, ReDuxMetaProvider } from '@opensource-dev/redux-meta'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { decode as atob, encode as btoa } from 'base-64'
import AsyncStorage from '@react-native-async-storage/async-storage'
import rnStyle from '@package/rn-style'

const Stack = createNativeStackNavigator()

// stacks
import root from '@screens'

// modules
import modules from '@modules' 

// Polyfill for atob and btoa in React Native
if (!global.atob) {
  global.atob = atob;
}

if (!global.btoa) {
  global.btoa = btoa;
}

// global redux-meta
global.$reduxMeta = new ReduxMeta()
global.$reduxMeta.useModules(modules())

// global react-native-style
global.$localStorage = AsyncStorage

// global react-native-style
global.$rnStyle = rnStyle

// global width | height
global.$windowWidth = Math.ceil(Dimensions.get('window').width)
global.$windowHeight = Math.ceil(Dimensions.get('window').height)

function App() { 
	useEffect(() => { // disabling back handler button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('back button execute...')
      return true
    })
    return () => backHandler.remove() 
  }, [])
  
  return (
    <ReDuxMetaProvider>
      <NavigationContainer style={styles.container}>
        <StatusBar style="dark" />

        <Stack.Navigator>
          <Stack.Screen
            name = 'root'
            component = { root }
            options = {{ headerShown: false }}
          />
        </Stack.Navigator>
		  </NavigationContainer>
    </ReDuxMetaProvider>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default memo (App)
