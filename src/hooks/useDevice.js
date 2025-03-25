import { useContext } from 'react'

// context
import { DeviceContext } from '@context/device'

const useDevice = () => {
  const context = useContext(DeviceContext)

  if (!context) {
    throw new Error('useDevice must be used within the DeviceProvider')
  }
  return context
}

export { useDevice }