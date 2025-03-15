import { useEffect, memo, useCallback } from 'react'
import { ToastAndroid } from 'react-native'

// utilities
import socket from '@utilities/socket'

// components
import { useComponent } from '@components'
const {
  BaseText,
  BaseIcon,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseGradient
} = useComponent()

// hooks
import { useBLE } from '@hooks/useBLE'

// images
import { images } from '@assets/images'

function Home ({ goto }) {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice
  } = useBLE()


  // ask bluetooth permission
  const askPermission = async () => {
    const permission = await requestPermissions()

    if (permission) {
      if (!connectedDevice) {
        scanForPeripherals()
      }
    }
  }

  useEffect(() => {
    askPermission()
  }, [])

  return (
    <BaseDiv styles="flex-1 bg-[#fff] ph-[20]">
      <BaseImage
        src={images.contentBG}
        styles="absolute top right w-[300] h-[450] opacity-[.05]"
      />
    </BaseDiv>
  )
}

export default memo (Home)