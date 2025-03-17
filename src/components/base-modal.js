import * as Animatable from 'react-native-animatable'

export default function BaseModal ({ children, customStyles, visible, styles = "w-full h-full bg-[rgba(0,0,0,.5)] absolute ph-[80] flex items-center justify-center" }) {
  let STYLES = global.$rnStyle(styles)

  if (!visible) {
    return null
  }

  if (customStyles) {
    STYLES = {
      ...STYLES,
      ...customStyles
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