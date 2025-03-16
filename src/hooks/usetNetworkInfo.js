import { useRef } from 'react'
import { NetworkInfo } from "react-native-network-info"
import PortScanner from 'react-native-find-local-devices'

const useNetworkInfo = () => {
  const scanner = useRef(null);

  const scanNetwork = async () => {
    return new Promise((resolve, reject) => {
      scanner.current = new PortScanner({
        timeout: 40,
        ports: [3000],
        onDeviceFound: (device) => {
          console.log("Found device:", device)
        },
        onFinish: (devices) => {
          console.log("Finished scanning, devices:", devices)
          resolve(devices)
          stopScan()
        },
        onCheck: () => {
          // do nothing...
        },
        onNoDevices: () => {
          resolve([])
        },
        onError: (error) => {
          reject(error)
        }
      })

      // Start scanning
      scanner.current.start()
    })
  }

  // Stop scanning if needed
  const stopScan = () => {
    if (scanner.current) {
      scanner.current.stop()
      console.log("Scanning stopped.")
    }
  }

  return {
    scanNetwork,
    networkInfo: async () => {
      const ipv4 = await NetworkInfo.getIPV4Address()

      return {
        ipv4
      }
    },
  }
}

export { useNetworkInfo }