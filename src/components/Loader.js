import { Animated, Easing } from 'react-native'
import { memo, useRef, useEffect } from 'react'

import { useComponent } from '@components'
const { BaseIcon } = useComponent()

function Loader ({ size = 16 }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    )
    spinAnimation.start()

    return () => spinAnimation.stop() // Cleanup on unmount
  }, [spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  })
  
  return (
    <Animated.View
      style={{ transform: [{ rotate: spin }] }}
    >
      <BaseIcon
        type="antdesign"
        name="loading1"
        color="#fff"
        size={16}
      />
    </Animated.View>
  )
}

export default memo(Loader)