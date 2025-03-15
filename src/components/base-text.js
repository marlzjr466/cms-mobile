import { useCallback } from 'react'
import { Text } from 'react-native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

function BaseText({ children, text, styles, customStyles, ellipsis, bold }) {
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
    'Righteous-Regular': require('@assets/fonts/Technica_Regular.ttf'),
    'Technica-Semi-Bold': require('@assets/fonts/Technica_Semi_Bold.ttf')
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
		<>
			<Text 
        onLayout={onLayoutRootView}
        style={[
            STYLES,
            { fontFamily: bold ? 'Technica-Semi-Bold' : 'Righteous-Regular' }
        ]}
        numberOfLines={ellipsis ? ellipsis : null}
        ellipsizeMode={ellipsis ? 'tail' : null}
      >
        { text || children }
      </Text>
		</>
	)
}

export default BaseText