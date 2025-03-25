import * as Animatable from 'react-native-animatable'
import { View, ScrollView } from 'react-native'
import { useRef, useState } from 'react'

export default function BaseDiv ({
  children,
  layout,
  styles,
  customStyles,
  scrollable,
  scrollToBottom,
  animatable,
  animation,
  duration,
  onInfiniteScroll
}) {
  const [lastScrollY, setLastScrollY] = useState(0)
  const scrollViewRef = useRef()
  
  let wrapper = null
  let STYLES = {}

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 10

    if (isBottom && contentOffset.y > lastScrollY) {
      if (onInfiniteScroll) {
        onInfiniteScroll()
      }
    }

    setLastScrollY(contentOffset.y)
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
        onScroll={handleScroll} 
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