import { LinearGradient } from 'expo-linear-gradient'

export default function BaseGradient ({ children, styles, customStyles, colors, horizontal }) {
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
    <LinearGradient
      style={STYLES}
      colors={colors}
      start={horizontal ? { x: -1, y: 0 } : { x: 0, y: -1 }}
      end={horizontal ? { x: 1, y: 0 } : { x: 0, y: 1 }}
    >
      { children }
    </LinearGradient>
  )
}