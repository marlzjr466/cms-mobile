import { useState, useEffect, memo } from "react"

// hooks
import { useBLE } from "@hooks"

// context
import { DeviceContext } from "@context/device"

function DeviceProvider ({ children }) {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice
  } = useBLE()

  useEffect(() => {
      askPermission()
    }, [])

  // ask bluetooth permission
  const askPermission = async () => {
    const permission = await requestPermissions()

    if (permission) {
      if (!connectedDevice) {
        scanForPeripherals()
      }
    }
  }

  return (
    <DeviceContext.Provider value={{ allDevices, connectToDevice, connectedDevice, disconnectFromDevice }}>
      {children}
    </DeviceContext.Provider>
  )
}

export default memo(DeviceProvider)