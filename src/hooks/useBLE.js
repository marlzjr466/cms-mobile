/* eslint-disable no-bitwise */
import { useMemo, useState, useEffect } from "react"
import { PermissionsAndroid, Platform } from "react-native"
import { BleManager } from "react-native-ble-plx"

import * as ExpoDevice from "expo-device"

function useBLE() {
  const bleManager = useMemo(() => new BleManager(), [])
  const [allDevices, setAllDevices] = useState([])
  const [connectedDevice, setConnectedDevice] = useState(null)

  useEffect(() => {
    return () => {
      bleManager.destroy()
    }
  }, [])

  const isBluetoothEnabled = async () => {
    const state = await bleManager.state()
    return state === "PoweredOn"
  }

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK"
          }
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } else {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ])

        return (
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        )
      }
    } else {
      return true
    }
  }

  const isDuplicteDevice = (devices, nextDevice) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1

  const scanForPeripherals = async () => {
    const btEnabled = await isBluetoothEnabled()
    if (!btEnabled) {
      console.log("Bluetooth is OFF. Ask user to enable it.")
      return
    }

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("BLE Scan Error:", error)
  
        if (error.errorCode === 1) {
          console.log("Bluetooth is OFF. Ask user to turn it on.")
        } else if (error.errorCode === 100) {
          console.log("BLE is unsupported on this device.")
        }
        return
      }

      if (device && device.name?.includes("Printer")) {
        setAllDevices(prevState => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device].filter(x => x.name)
          }
          
          return prevState
        })
      }
    })
  }

  const connectToDevice = async device => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id)
      setConnectedDevice(deviceConnection)
      await deviceConnection.discoverAllServicesAndCharacteristics()
      bleManager.stopDeviceScan()
    } catch (e) {
      console.log("FAILED TO CONNECT", e)
    }
  }

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id)
      setConnectedDevice(null)
    }
  }

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice
  }
}

export { useBLE }
