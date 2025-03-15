import { useEffect, memo, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as ScreenOrientation from 'expo-screen-orientation'
import _ from 'lodash'

const Stack = createNativeStackNavigator()

// components
import SideMenu from '@components/SideMenu'

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
import { useBLE, useScreenSize } from '@hooks'

// images
import { images } from '@assets/images'

function Dashboard ({ goto, childStacks }) {
  const { width, height } = useScreenSize()
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice
  } = useBLE()

  const [activeScreen, setActiveScreen] = useState('home')


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
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    askPermission()
  }, [])

  return (
    <>
      <StatusBar hidden />
      <BaseDiv styles="h-full w-full flex flex-row pv-[10]">
        <BaseGradient
          styles={`absolute top left w-full h-[${height}]`}
          colors={['#afe9fd', '#afe9fd']}
          // colors={['#b3fbff', '#05979e']}
          horizontal={true}
        />

        <BaseImage
          src={images.contentBG}
          styles="w-[100] absolute top left opacity-[.03]"
        />

        <SideMenu goto={goto} activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        <BaseDiv styles="flex-1 h-full bg-[#f9f9f9] btlr-[20] bblr-[20] overflow-hidden">
          <BaseDiv styles="w-full flex flex-row items-center h-[70] bbw-[1] bbc-[#e3eced] bg-[white] ph-[30]">
            <BaseText
              bold={true}
              styles="color-[#3c4447] w-[50%] fs-[18] flex gap-[2]"
            >
              {activeScreen === 'home' ? 'Dashboard' : _.capitalize(activeScreen)}
            </BaseText>

            <BaseGradient
              styles="w-[35] h-[35] br-[20] bg-[#e6e6e6] flex items-center justify-center overflow-hidden ml-[auto]"
              colors={['#0b6167', '#61e7f0']}
              horizontal={true}
            >
              <BaseImage
                src={images.attendantIcon}
                styles="w-full h-full"
              />
            </BaseGradient>

            <BaseDiv styles="flex flex-col ml-[10]">
              <BaseText
                bold={true}
                styles="color-[#3c4447] fs-[13] flex gap-[2]"
              >
                Athena Xiantelle Shekinah
              </BaseText>

              <BaseText styles="color-[#3c4447] fs-[11] flex gap-[2] opacity-[.7]">
                Clinic Attendant
              </BaseText>
            </BaseDiv>
          </BaseDiv>

          <Stack.Navigator
            screenOptions={{
              animation: "fade"
            }}
          >
            {
              childStacks.map((child, i) => (
                <Stack.Screen
                  key={i}
                  name={child.name}
                  component={child.component}
                  options={child.options}
                />
              ))
            }
          </Stack.Navigator>
        </BaseDiv>
      </BaseDiv>
    </>
  )
}

export default memo(Dashboard)