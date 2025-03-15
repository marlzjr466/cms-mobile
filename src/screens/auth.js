import { useEffect, memo, useState } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'

// utilities
import socket from '@utilities/socket'

// hooks
import { useStorage, useMeta, useAuth } from '@hooks'

// components
import { useComponent } from '@components'

// images
import { images } from '@assets/images'

const {
  BaseText,
  BaseIcon,
  BaseInput,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseGradient
} = useComponent()

function Auth ({ goto }) {
  const storage = useStorage()
  const { login, auth: userAuth } = useAuth()
  const { metaActions } = useMeta()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const auth = {
    ...metaActions('auth', ['ping'])
  }

  useEffect(() => {
    async function init () {
      const host = await storage.get('api-host')
      socket.connect(host)

      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    }
    
    init()
  }, [])

  const handleLogin = () => {
    login({username, password}, () => {
      setUsername('')
      setPassword('')
      goto({ child: 'dashboard' })
    })
  }

  return (
    <BaseDiv styles="flex-1 bg-[#fff]">
      <BaseImage
        src={images.contentBG}
        styles="absolute top right w-[500] h-[650] opacity-[.05]"
      />

      <BaseGradient
        styles={`flex row-reverse h-[280] bblr-[100] bbrr-[200] opacity-[.7] w-[${global.$windowWidth}]`}
        colors={['#ffa52e', '#ff651a']}
        horizontal={true}
      />

      <BaseImage
        src={images.loginHero}
        styles="w-[300] h-[300] absolute top-[90] right-[30]"
      />

      <BaseDiv styles={`w-[${global.$windowWidth-150}] flex mt-[80] gap-[10] ml-[50]`}>
        <BaseText
          styles="color-[#11335a] fs-[24]"
          bold={true}
        >
          Login to your Account
        </BaseText>

        <BaseText styles={`w-[100%] color-[rgba(0,0,0,.5)] fs-[15] mt-[10]`}>
          Hello there, welcome back! Please enter your login credentials below to continue.
        </BaseText>

        <BaseText styles={`color-[rgba(0,0,0,.5)] fs-[13] mt-[50]`}>
          Username
        </BaseText>

        <BaseInput
          styles={`w-[${global.$windowWidth-110}] h-[50] bc-[rgba(0,0,0,.3)] bw-[1] br-[10] ph-[15] fs-[15] mt-[-5]`}
          placeholder="Enter your username here"
          action={value => setUsername(value)}
        />

        <BaseText styles={`color-[rgba(0,0,0,.5)] fs-[13] mt-[10]`}>
          Password
        </BaseText>

        <BaseInput
          styles={`w-[${global.$windowWidth-110}] h-[50] bc-[rgba(0,0,0,.3)] bw-[1] br-[10] ph-[15] fs-[15] mt-[-5]`}
          placeholder="Enter your password here"
          secure
          action={value => setPassword(value)}
        />
      </BaseDiv>

      <BaseDiv
        styles={`flex w-[${global.$windowWidth}] items-center absolute bottom-[30]`}
        animatable={true}
        animation='bounceIn'
        duration={1500}
      >
        <BaseGradient
          styles="w-[230] h-[60] br-[40] p-[4]"
          colors={['#ffbf6a', '#ff651a']}
          horizontal={true}
        >
          <BaseButton
            styles="w-[100%] h-[100%] br-[40] bw-[4] bc-[#fff] flex justify-center items-center"
            action={handleLogin}
            // disabled
          >
            <BaseText
              styles="color-[#11335a] opacity-[.7] fs-[15]"
              bold={true}
            >
              Login
            </BaseText>
          </BaseButton>
        </BaseGradient>
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo (Auth)