import { memo, useEffect, useState } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import PortScanner from 'react-native-find-local-devices'

// components
import { useComponent } from '@components'
import DeviceModal from '@modals/device-connection'
const {
  BaseText,
  BaseInput,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseIcon,
  BaseGradient,
  BaseModal
} = useComponent()

import { useGlobalModals } from '@modals'

// hooks
import { useStorage, useMeta, useAddressReachable, useAuth, useToast, useDevice, useModal } from '@hooks'

// images
import { images } from '@assets/images'

function Settings () {
  const { DeviceConnection, connectedDevice } = useGlobalModals()
  const storage = useStorage()
  const { metaMutations, metaStates, metaActions } = useMeta()
  const { isReachable } = useAddressReachable()
  const { auth, logout } = useAuth()
  const { show: showToast } = useToast()
  const { show, hide } = useModal()
  const { allDevices, connectToDevice } = useDevice()

  const [showModal, setShowModal] = useState(false)
  const [localServer, setLocalServer] = useState(null)
  const [scanner, setScanner] = useState(null)
  const [noServerFound, setNoServerFound] = useState(false)
  const [hostAddress, setHostAddress] = useState(null)

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const meta = {
    ...metaStates('home', ['deviceName'])
  }

  const host = {
    ...metaMutations('host', ['SET_ADDRESS'])
  }

  const attendant = {
    ...metaStates('attendants', ['profile']),
    ...metaActions('attendants', ['getProfile', 'patch'])
  }

  const authentication = {
    ...metaStates('auth', ['username']),
    ...metaMutations('auth', ['SET_USERNAME']),
    ...metaActions('auth', ['changePassword'])
  }

  const [username, setUsername] = useState(authentication.username || auth.username)
  const [newPassword, setNewPassword] = useState('')
  const [retypePassword, setRetypeNewPassword] = useState('')

  useEffect(() => {
    init()
    loadProfile()
  }, [])

  useEffect(() => {
    if (attendant.profile) {
      setFirstname(attendant.profile.first_name)
      setLastname(attendant.profile.last_name)
      setPhoneNumber(attendant.profile.phone_number)
    }
  }, [attendant.profile])

  const loadProfile = async () => {
    await attendant.getProfile(auth.attendant_id)
  }

  const handleSaveProfile = async () => {
    try {
      await attendant.patch({
        key: 'id',
        data: {
          id: auth.attendant_id,
          first_name: firstname,
          last_name: lastname,
          phone_number: phoneNumber
        }
      })
      
      loadProfile()
      showToast('Profile updated successfully.')
    } catch (error) {
      showToast(error.message)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== retypePassword) {
      return showToast('Entered password is not the same')
    }

    try {
      await authentication.changePassword({
        id: auth.id,
        username,
        password: newPassword
      })
      
      authentication.SET_USERNAME(username)
      setNewPassword('')
      setRetypeNewPassword('')
      showToast('Username or password updated successfully')
    } catch (error) {
      showToast(error.message)
    }
  }

  async function init() {
    const host = await storage.get('api-host')
    setHostAddress(host)

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

  const showDeviceConnectionModal = () => {
    show(
      <DeviceConnection
        connectToPeripheral={async device => {
          await connectToDevice(device)
          showToast(`Success! Connected to ${device.name}`)
          hide()
        }}
        devices={allDevices}
        onHide={hide}
      />  
    )
  }

  return (
    <BaseDiv styles="flex-1 bg-[#f9f9f9] p-[20] flex flex-col gap-[5] relative">
      {/* Host server */}
      <BaseDiv styles="w-full flex flex-row gap-[5]">
        <BaseDiv styles="flex-1 bg-[white] br-[10] bw-[1] bc-[rgba(0,0,0,.1)] p-[10]">
          <BaseText styles="color-[rgba(0,0,0,.3)] fs-[12]">
            API Server
          </BaseText>

          <BaseText styles="color-[rgba(0,0,0,.6)] fs-[13] mt-[15] pl-[3]">
            Host Address
          </BaseText>

          <BaseInput
            defaultValue={hostAddress}
            styles="w-full h-[45] br-[10] bg-[white] ph-[15] bw-[1] bc-[rgba(0,0,0,.1)] fs-[13] mt-[5]"
            placeholder="Enter host manually (e.g., http://192.168.1.100:3000)"
            action={value => setHostAddress(value)}
          />

          <BaseDiv styles="flex flex-row items-center gap-[5]">
            <BaseButton
              styles="p-[10] w-[160] flex flex-row items-center justify-center gap-[5] br-[7] mt-[15]"
              gradient={true}
              gradientColors={['#ffbf6a', '#ff651a']}
              action={async () => {
                await logout()
                host.SET_ADDRESS(hostAddress)
              }}
            >
              <BaseIcon
                type="materialcommunityicons"
                name="connection"
                color="#fff"
                size={13}
              />
              <BaseText styles="color-[#fff] fs-[13]">
                Connect Manually
              </BaseText>
            </BaseButton>

            <BaseButton
              styles="p-[10] w-[130] flex flex-row items-center justify-center gap-[5] br-[7] mt-[15]"
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
                size={13}
              />
              <BaseText styles="color-[#fff] fs-[13]">
                Scan Server
              </BaseText>
            </BaseButton>
          </BaseDiv>
        </BaseDiv>

        <BaseDiv styles="flex-1 bg-[white] br-[10] bw-[1] bc-[rgba(0,0,0,.1)] p-[10]">
          <BaseText styles="color-[rgba(0,0,0,.3)] fs-[12]">
            Thermal Printer
          </BaseText>

          <BaseText styles="color-[rgba(0,0,0,.6)] fs-[13] mt-[15] pl-[3]">
            Name
          </BaseText>

          <BaseDiv styles="w-full flex justify-center h-[45] br-[10] bg-[white] ph-[15] bw-[1] bc-[rgba(0,0,0,.1)] mt-[5]">
            <BaseText styles={`fs-[13] ${!meta.deviceName ? 'opacity-[.3]' : ''}`}>
              {meta.deviceName ? meta.deviceName : '-----'}
            </BaseText>
          </BaseDiv>

          <BaseDiv styles="flex flex-row items-center gap-[5]">
            <BaseButton
              styles="p-[10] w-[130] flex flex-row items-center justify-center gap-[5] br-[7] mt-[15]"
              gradient={true}
              gradientColors={['#ffbf6a', '#ff651a']}
              action={showDeviceConnectionModal}
            >
              <BaseIcon
                type="materialcommunityicons"
                name="printer"
                color="#fff"
                size={13}
              />
              <BaseText styles="color-[#fff] fs-[13]">
                Scan Printer
              </BaseText>
            </BaseButton>
          </BaseDiv>
        </BaseDiv>
      </BaseDiv>
      
      {/* Profile */}
      <BaseDiv styles="w-full bg-[white] br-[10] bw-[1] bc-[rgba(0,0,0,.1)] p-[10]">
        <BaseText styles="color-[rgba(0,0,0,.3)] fs-[12]">
          Basic Information
        </BaseText>

        <BaseDiv styles="w-full flex flex-row gap-[5]">
          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.6)] fs-[13] mt-[15] pl-[3]">
              Firstname
            </BaseText>

            <BaseInput
              defaultValue={firstname}
              styles="w-full h-[45] br-[10] bg-[white] ph-[15] bw-[1] bc-[rgba(0,0,0,.1)] fs-[13] mt-[5]"
              action={value => setFirstname(value)}
            />
          </BaseDiv>

          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.6)] fs-[13] mt-[15] pl-[3]">
              Lastname
            </BaseText>

            <BaseInput
              defaultValue={lastname}
              styles="w-full h-[45] br-[10] bg-[white] ph-[15] bw-[1] bc-[rgba(0,0,0,.1)] fs-[13] mt-[5]"
              action={value => setLastname(value)}
            />
          </BaseDiv>

          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.6)] fs-[13] mt-[15] pl-[3]">
              Phone number
            </BaseText>

            <BaseInput
              defaultValue={phoneNumber}
              styles="w-full h-[45] br-[10] bg-[white] ph-[15] bw-[1] bc-[rgba(0,0,0,.1)] fs-[13] mt-[5]"
              action={value => setPhoneNumber(value)}
            />
          </BaseDiv>
        </BaseDiv>
        
          <BaseButton
            styles="p-[10] w-[160] flex flex-row items-center justify-center gap-[5] br-[7] mt-[15]"
            gradient={true}
            gradientColors={['#ffbf6a', '#ff651a']}
            action={handleSaveProfile}
          >
            <BaseIcon
              type="materialcommunityicons"
              name="content-save-check-outline"
              color="#fff"
              size={15}
            />
            <BaseText styles="color-[#fff] fs-[13]">
              Save Changes
            </BaseText>
          </BaseButton>
      </BaseDiv>

      {/* Credentials */}
      <BaseDiv styles="w-full bg-[white] br-[10] bw-[1] bc-[rgba(0,0,0,.1)] p-[10]">
        <BaseText styles="color-[rgba(0,0,0,.3)] fs-[12]">
          Credentials
        </BaseText>

        <BaseDiv styles="w-full flex flex-row gap-[5]">
          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.6)] fs-[13] mt-[15] pl-[3]">
              Username
            </BaseText>

            <BaseInput
              defaultValue={username}
              styles="w-full h-[45] br-[10] bg-[white] ph-[15] bw-[1] bc-[rgba(0,0,0,.1)] fs-[13] mt-[5]"
              action={value => setUsername(value)}
            />
          </BaseDiv>

          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.6)] fs-[13] mt-[15] pl-[3]">
              New password
            </BaseText>

            <BaseInput
              secure
              styles="w-full h-[45] br-[10] bg-[white] ph-[15] bw-[1] bc-[rgba(0,0,0,.1)] fs-[13] mt-[5]"
              action={value => setNewPassword(value)}
            />
          </BaseDiv>

          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.6)] fs-[13] mt-[15] pl-[3]">
              Re-type new Password
            </BaseText>

            <BaseInput
              secure
              styles="w-full h-[45] br-[10] bg-[white] ph-[15] bw-[1] bc-[rgba(0,0,0,.1)] fs-[13] mt-[5]"
              action={value => setRetypeNewPassword(value)}
            />
          </BaseDiv>
        </BaseDiv>
        
          <BaseButton
            styles="p-[10] w-[160] flex flex-row items-center justify-center gap-[5] br-[7] mt-[15]"
            gradient={true}
            gradientColors={['#ffbf6a', '#ff651a']}
            action={handleChangePassword}
          >
            <BaseIcon
              type="materialcommunityicons"
              name="content-save-check-outline"
              color="#fff"
              size={15}
            />
            <BaseText styles="color-[#fff] fs-[13]">
              Save Changes
            </BaseText>
          </BaseButton>
      </BaseDiv>
      
      {/* Modal */}
      <BaseModal
        visible={showModal}
        styles="w-[110%] h-[112%] absolute ph-[80] bg-[rgba(0,0,0,0.1)] flex items-center justify-center"
      >
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
                      action={async () => {
                        await logout()
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

export default memo(Settings)