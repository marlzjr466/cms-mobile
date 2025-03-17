import { memo, useEffect, useState } from 'react'
import PortScanner from 'react-native-find-local-devices'

// components
import { useComponent } from '@components'
const {
  BaseText,
  BaseInput,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseIcon,
  BaseModal
} = useComponent()

// hooks
import { useMeta, useAddressReachable } from '@hooks'

// images
import { images } from '@assets/images'

function SetupHost ({ hide }) {
  const { metaMutations } = useMeta()
  const { isReachable } = useAddressReachable()

  const host = {
    ...metaMutations('host', ['SET_ADDRESS'])
  }

  const [showModal, setShowModal] = useState(false)
  const [localServer, setLocalServer] = useState(null)
  const [scanner, setScanner] = useState(null)
  const [noServerFound, setNoServerFound] = useState(false)

  useEffect(() => {
    init()
  }, [])

  function init() {
    setScanner(
      new PortScanner({
        timeout: 40,
        ports: [3000],
        onDeviceFound: async device => {
          const url = `http://${device.ipAddress}:${device.port}`

          console.log('device', JSON.stringify(device, null, 2))
          console.log('url', url)
          const res = await isReachable(url)

          if (res.success) {
            setLocalServer({...device, hostname: res.hostname})
            
            setNoServerFound(false)
            stopScan()
          }
        },
        onFinish: () => {
          stopScan()
        },
        onCheck: () => {},
        onNoDevices: () => {
          setNoServerFound(true)
        },
        onError: () => {}
      })
    )
  }

  const stopScan = () => {
    scanner?.stop()
  }

  return (
    <BaseDiv styles="w-[400] p-[20] bg-[white] br-[15] flex flex-col items-center justify-center gap-[10]">
      {
        noServerFound ? (
          <>
            <BaseIcon
              styles="opacity-[.1]"
              type="materialcommunityicons"
              name="lan-disconnect"
              color="#000"
              size={75}
            />
            
            <BaseText bold={true} styles="opacity-[.8]"> 
              No Server Found!
            </BaseText>

            <BaseButton
              styles="w-[155] p-[10] flex flex-row items-center justify-center gap-[5] br-[10] mt-[10]"
              gradient={true}
              gradientColors={['#ffbf6a', '#ff651a']}
              action={() => {
                setNoServerFound(false)
                setLocalServer(null)
                scanner?.start()
              }}
            >
              <BaseIcon
                type="materialcommunityicons"
                name="connection"
                color="#fff"
                size={15}
              />
              <BaseText styles="color-[#fff] fs-[13]">
                Retry
              </BaseText>
            </BaseButton>
          </>
        ) : (
          !localServer ? (
            <>
              <BaseImage
                styles="w-[100] h-[100]"
                src={images.connecting}
              />

              <BaseText styles="opacity-[.5]">
                Looking for local server...
              </BaseText>
            </>
          ) : (
            <>
              <BaseText styles="w-full opacity-[.8]">
                Server Found:
              </BaseText>

              <BaseDiv styles="w-full flex flex-row items-center gap-[10] bg-[rgba(0,0,0,.05)] br-[10] p-[10]">
                <BaseIcon
                  styles="opacity-[.5]"
                  type="materialcommunityicons"
                  name="lan-connect"
                  color="#000"
                  size={25}
                />

                <BaseDiv styles="flex-1 flex flex-row">
                  <BaseText bold={true} styles="fs-[14]">
                    {localServer.ipAddress}
                  </BaseText>

                  <BaseText bold={true} styles="fs-[14] ml-[auto]">
                    {localServer.hostname}
                  </BaseText>
                </BaseDiv>
              </BaseDiv>

              <BaseDiv styles="w-full flex flex-row gap-[5] mt-[5]">
                <BaseButton
                  styles="w-[175] p-[10] bg-[rgba(0,0,0,.05)] flex flex-row items-center justify-center gap-[5] br-[10]"
                  action={() => {
                    hide()
                    setNoServerFound(true)
                    setLocalServer(null)
                  }}
                >
                  <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13]">
                    Cancel
                  </BaseText>
                </BaseButton>

                <BaseButton
                  styles="w-[180] p-[10] flex flex-row items-center justify-center gap-[5] br-[10]"
                  gradient={true}
                  gradientColors={['#ffbf6a', '#ff651a']}
                  action={() => {
                    host.SET_ADDRESS(`http://${localServer.ipAddress}`)
                    hide()
                    setNoServerFound(true)
                    setLocalServer(null)
                  }}
                >
                  <BaseIcon
                    type="materialcommunityicons"
                    name="connection"
                    color="#fff"
                    size={15}
                  />
                  <BaseText styles="color-[#fff] fs-[13]">
                    Connect
                  </BaseText>
                </BaseButton>
              </BaseDiv>
            </>
          )
        ) 
      }
    </BaseDiv>
  )
}

export default memo(SetupHost)