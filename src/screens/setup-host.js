import { useEffect, memo, useState } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'

// hooks
import { useToast, useMeta } from '@hooks'

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
  BaseGradient
} = useComponent()

function SetupHost () {
  const { metaMutations } = useMeta()
  const [hostAddress, setHostAddress] = useState('')

  const host = {
    ...metaMutations('host', ['SET_ADDRESS'])
  }

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
  }, [])

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
        src={images.setupHero}
        styles="w-[450] h-[450] absolute top-[0] right-[-30]"
      />

      <BaseDiv styles={`w-[${global.$windowWidth-150}] flex mt-[80] gap-[10] ml-[50]`}>
        <BaseText
          styles="color-[#11335a] fs-[24]"
          bold={true}
        >
          Setup API Host Address
        </BaseText>

        <BaseText styles={`w-[100%] color-[rgba(0,0,0,.5)] fs-[15] mt-[10]`}>
          To get started, please enter your API host address below. This will allow the app to connect to the server.
        </BaseText>

        <BaseText styles={`color-[rgba(0,0,0,.5)] fs-[13] mt-[50]`}>
          API Host Address
        </BaseText>
      </BaseDiv>

      <BaseInput
        styles={`w-[${global.$windowWidth-110}] h-[50] bc-[rgba(0,0,0,.3)] bw-[1] br-[10] ml-[50] ph-[15] fs-[15] mt-[5]`}
        placeholder="Enter host (e.g., http://192.168.1.100)"
        action={value => setHostAddress(value)}
      />

      <BaseDiv
        styles="flex w-[100%] items-center absolute bottom-[30]"
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
            action={() => host.SET_ADDRESS(hostAddress)}
          >
            <BaseText
              styles="color-[#11335a] opacity-[.7] fs-[15]"
              bold={true}
            >
              Save & Connect
            </BaseText>
          </BaseButton>
        </BaseGradient>
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo (SetupHost)