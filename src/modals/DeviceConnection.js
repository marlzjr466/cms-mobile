import React, { useCallback } from "react"
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Button
} from "react-native"

const DeviceModalListItem = props => {
  const { item, connectToPeripheral, closeModal } = props

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item)
    closeModal()
  }, [closeModal, connectToPeripheral, item.item])

  return (
    item.item.name != null ? (
      <TouchableOpacity
        onPress={connectAndCloseModal}
        style={modalStyle.ctaButton}
      >
        <Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>
      </TouchableOpacity>
    ) : ''
  )
}

const DeviceModal = props => {
  const { devices, connectToPeripheral, closeModal } = props
  
  const { metaStates, metaActions } = global.$reduxMeta.useMeta()
  const meta = {
    ...metaStates('device-connection', ['deviceModal']),
    ...metaActions('device-connection', ['showDeviceModal'])
  }

  const renderDeviceModalListItem = useCallback(
    item => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={() => meta.showDeviceModal(false)}
        />
      )
    },
    [closeModal, connectToPeripheral]
  )

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={meta.deviceModal}
    >
      <SafeAreaView style={modalStyle.container}>
        <View style={modalStyle.wrapper}>
        <Button
          title="Close"
          onPress={() => {
            meta.showDeviceModal(false)
          }}
        />
          <Text style={modalStyle.modalTitleText}>
            Tap on a device to connect
          </Text>

            {
              devices.length > 0
                ? <FlatList
                  contentContainerStyle={modalStyle.modalFlatlistContiner}
                  data={devices}
                  renderItem={renderDeviceModalListItem}
                />
                : <Text style={{
                    width: '100%',
                    textAlign: 'center',
                    marginTop: 100,
                    fontSize: 15,
                    color: 'rgba(0,0,0,.4)'
                }}>Searching for Printer devices..</Text>
            }
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const modalStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.1)",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  wrapper: {
    width: 300,
    height: 350,
    backgroundColor: '#fff',
    borderRadius: 10
  },

  modalFlatlistContiner: {
    paddingVertical: 20,
    height: 300,
  },

  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8
  },

  modalTitleText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center"
  },

  ctaButton: {
    backgroundColor: "#08BB74",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 5
  },

  ctaButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white"
  }
})

export default DeviceModal
