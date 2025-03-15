import * as Animatable from 'react-native-animatable'

export default function BaseAnimatable ({ children, styles, customStyles, animation, duration, delay }) {
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
    <Animatable.View
      style = { STYLES }
      animation = { animation }
      duration = { duration }
      delay={ delay || 0 }
    >
      { children }
    </Animatable.View>
  )
}