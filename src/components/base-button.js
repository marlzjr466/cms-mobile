import { TouchableOpacity, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

function BaseButton ({
  children,
  styles,
  customStyles,
  disabled,
  gradient, 
  gradientColors, 
  action 
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

	return (
		<>
      {
        gradient ? 
          <TouchableOpacity
            onPress={action}
            disabled={disabled}
            style={{opacity: disabled ? 0.7 : 1}}
          >
            <LinearGradient 
              style={STYLES}
              colors={gradientColors}
            >  
              { children }
            </LinearGradient>
          </TouchableOpacity> :

          <TouchableOpacity
            style={STYLES}
            onPress={action}
            disabled={disabled}
          >   
            { children }
          </TouchableOpacity>
      }
		</>
	)
}

export default BaseButton