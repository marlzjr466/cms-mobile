import { useEffect, memo, useState } from 'react'
import { View, Text, Button } from 'react-native'

function slider ({ goto, styles }) {
  return (
    <View style={styles.container}>
      <Text>This is slider</Text>

      <Button
        title="Goto auth screen"
        onPress={() => {
          goto({ child: 'auth' })
        }}
      />
    </View>
  )
}

export default memo (slider)