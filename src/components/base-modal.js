import * as Animatable from 'react-native-animatable'

export default function BaseModal ({ children, styles, customStyles, visible }) {
  let STYLES = {}

  if (!visible) {
    return null
  }

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
    <Animatable.View
      style={STYLES}
      animation='fadeIn'
      duration={500}
    >
      { children }
    </Animatable.View>
  )
}