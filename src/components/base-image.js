import { Image } from 'react-native'

function BaseImage ({ styles, src, customStyles }) {
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
    <Image 
      style = { STYLES }
      source = { src }
    />
  )
}

export default BaseImage