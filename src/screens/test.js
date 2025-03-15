import { useEffect, memo, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Text, Button } from 'react-native'

// hooks
import { useBLE } from '@hooks/useBLE'

// modals
import DeviceModal from '@modals/DeviceConnection'

function Index() {
  const { metaStates, metaMutations, metaActions, metaGetters } = global.$reduxMeta.useMeta()
  const meta = {
    ...metaStates({
      fullname: 'name/fullname',
      name: 'name/name',

      permissionEnabled: 'device-connection/permissionEnabled',
      deviceModal: 'device-connection/deviceModal'
    }),

    ...metaMutations({
      setName: 'name/SET_NAME'
    }),

    // ...metaActions('device-connection', [
    //   'askPermission',
    //   'showDeviceModal'
    // ]),

    // ...metaActions('name', [
    //   'test',
    // ]),

    ...metaActions({
      askPermission: 'device-connection/askPermission',
      showDeviceModal: 'device-connection/showDeviceModal',

      test: 'name/test'
    }),

    ...metaGetters({
      gfns: 'name/getFullname'
    })
  }

  const {
		requestPermissions,
		scanForPeripherals,
		allDevices,
		connectToDevice,
		connectedDevice,
		printer,
		disconnectFromDevice
	} = useBLE()

  // use effects
  useEffect(() => {
		const askPermission = async () => {
      const permission = await requestPermissions()

      if (permission) {
        if (!connectedDevice) {
          scanForPeripherals()
        }
      }
		}

		askPermission()
	}, [])
  
  return (
    <View style={styles.container}> 
      <Text>This is the app view: { meta.name }</Text>
      <Text>This is the app view: { meta.fullname }</Text>
      <StatusBar style="auto" /> 

      <Button
        title="Test dispatch"
        onPress={() => {
          meta.test()
          meta.setName('Biboy Langomez II')
          console.log(meta.gfns, 'getters here')
        }}
      />

      <Button
        title="Search printer"
        onPress={() => {
          meta.showDeviceModal(true) 
        }}
      />

      <DeviceModal
        closeModal={() => meta.showDeviceModal(false)}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default memo(Index)
