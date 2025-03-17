import { useCallback } from 'react'
import { useFonts } from 'expo-font'
import { TextInput } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function BaseInput({
  styles,
  customStyles,
  secure,
  placeholder,
  type,
  value,
  editable,
  action,
  defaultValue
}) {
  let STYLES = {}

  if (styles) {
    STYLES = global.$rnStyle(styles)
    if (customStyles) {
      STYLES = {
        ...STYLES,
        ...customStyles
      }
    }
  }

  const [fontsLoaded] = useFonts({
    'Righteous-Regular': require('@assets/fonts/Technica_Regular.ttf')
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
      }
    }, [fontsLoaded])
  
    if (!fontsLoaded) {
      return null
    }
  
  return (
    <TextInput
      onLayout={onLayoutRootView}
      style={[
        STYLES,
        { fontFamily: 'Righteous-Regular' }
      ]}
      keyboardType = { type || null }
      secureTextEntry = { secure }
      placeholder = { placeholder }
      placeholderTextColor="rgba(0,0,0,.25)"
      value = { value }
      onChangeText = { action }
      editable = { editable || true }
      selectTextOnFocus= { editable || true }
      defaultValue={defaultValue || null}
    />
  )
}