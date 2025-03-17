import { useEffect, memo, useState } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import PortScanner from 'react-native-find-local-devices'

// hooks
import { useToast, useMeta, useAddressReachable, useScreenSize } from '@hooks'

// components
import { useComponent } from '@components'

// images
import { images } from '@assets/images'

const {
  BaseText,
  BaseInput,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseGradient,
  BaseIcon,
  BaseModal
} = useComponent()

function SetupHost () {
  const { metaMutations } = useMeta()
  const { isReachable } = useAddressReachable()
  const { width } = useScreenSize()
  const [hostAddress, setHostAddress] = useState('')

  const host = {
    ...metaMutations('host', ['SET_ADDRESS'])
  }

  const [showModal, setShowModal] = useState(false)
  const [localServer, setLocalServer] = useState(null)
  const [scanner, setScanner] = useState(null)
  const [noServerFound, setNoServerFound] = useState(false)

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    init()
  }, [])

  const init = () => {
    setScanner(
      new PortScanner({
        timeout: 40,
        ports: [3000],
        onDeviceFound: async device => {
          const url = `http://${device.ipAddress}:${device.port}`
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
    <BaseDiv styles="flex-1 bg-[#fff] relative">
      <BaseImage
        src={images.contentBG}
        styles="absolute top right w-[500] h-[650] opacity-[.05]"
      />

      <BaseGradient
        styles={`flex row-reverse h-[280] bblr-[100] bbrr-[200] opacity-[.7] w-[${width}]`}
        colors={['#ffa52e', '#ff651a']}
        horizontal={true}
      />

      <BaseImage
        src={images.setupHero}
        styles="w-[450] h-[450] absolute top-[0] right-[-30]"
      />

      <BaseDiv styles={`w-[${width-150}] flex mt-[80] gap-[10] ml-[50]`}>
        <BaseText
          styles="color-[#11335a] fs-[24]"
          bold={true}
        >
          Setup API Host Address
        </BaseText>

        <BaseText styles={`w-[100%] color-[rgba(0,0,0,.5)] fs-[15] mt-[10]`}>
          To get started, click the `Scan server` button or enter your API host address manually below to connect to the server.
        </BaseText>

        <BaseButton
          styles="ph-[10] pv-[15] w-[170] flex flex-row items-center justify-center gap-[5] br-[10] mt-[50]"
          gradient={true}
          gradientColors={['#ffbf6a', '#ff651a']}
          action={() => {
            scanner?.start()
            setShowModal(true)
          }}
        >
          <BaseIcon
            type="materialcommunityicons"
            name="connection"
            color="#fff"
            size={15}
          />
          <BaseText styles="color-[#fff] fs-[15]">
            Scan Server
          </BaseText>
        </BaseButton>

        <BaseText bold={true} styles="color-[rgba(0,0,0,.5)] fs-[15] ml-[10] mv-[30]">
          OR
        </BaseText>

        <BaseText styles={`color-[rgba(0,0,0,.5)] fs-[13]`}>
          API Host Address
        </BaseText>
      </BaseDiv>

      <BaseInput
        styles={`w-[${global.$windowWidth-110}] h-[50] bc-[rgba(0,0,0,.3)] bw-[1] br-[10] ml-[50] ph-[15] fs-[15] mt-[5]`}
        placeholder="Enter host manually (e.g., http://192.168.1.100:3000)"
        action={value => setHostAddress(value)}
      />

      <BaseButton
        styles="ph-[10] pv-[15] w-[170] flex flex-row items-center justify-center gap-[5] br-[10] ml-[50] mt-[15]"
        gradient={true}
        gradientColors={['#ffbf6a', '#ff651a']}
        action={() => host.SET_ADDRESS(hostAddress)}
      >
        <BaseIcon
          type="materialcommunityicons"
          name="connection"
          color="#fff"
          size={15}
        />
        <BaseText styles="color-[#fff] fs-[13]">
          Connect Manually
        </BaseText>
      </BaseButton>

      <BaseModal visible={showModal}>
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
                        setShowModal(false)
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
                        setShowModal(false)
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
      </BaseModal>
    </BaseDiv>
  )
}

export default memo (SetupHost)