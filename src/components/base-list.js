import { FlatList } from 'react-native'

export default function BaseList ({ styles, customStyles, data, renderItem }) {
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
    <FlatList
      contentContainerStyle={STYLES}
      data={data}
      renderItem={renderItem}
    />
  )
}