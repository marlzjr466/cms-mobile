import * as Animatable from 'react-native-animatable'
import { View, ScrollView } from 'react-native'
import { useRef } from 'react'

export default function BaseDiv ({
  children,
  layout,
  styles,
  customStyles,
  scrollable,
  scrollToBottom,
  animatable,
  animation,
  duration
}) {
  const scrollViewRef = useRef()
  
  let wrapper = null
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

  animatable
    ?  wrapper = <Animatable.View
        style = { STYLES }
        animation = { animation }
        duration = { duration }
      >
        { children }
      </Animatable.View>

    : wrapper = scrollable 
      ? <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={
          scrollToBottom 
            ? () => { scrollViewRef.current.scrollToEnd({ animated: true }) }
            : () => {}
      }
        // style={{
        //   width: '100%',
        //   height: '100%'
        // }}
      >
        <View style = { STYLES }>
          { children }
        </View>
      </ScrollView>
      : <View style = { STYLES }>
        { children }
      </View>

  return wrapper
}