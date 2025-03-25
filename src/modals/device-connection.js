import React, { useCallback, useRef, memo } from "react"

// images
import { images } from '@assets/images'

// hooks
import { useMeta } from '@hooks'

// components
import { useComponent } from '@components'
const {
  BaseText,
  BaseIcon,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseModal,
  BaseList,
  BaseAnimatable
} = useComponent()

function DeviceConnection ({ devices, connectToPeripheral, onHide }) {
  const { metaMutations } = useMeta()
  
  const meta = {
    ...metaMutations('home', [
      'SET_DEVICE'
    ])
  }

  const listDelayAnimation = useRef(0)
  
  return (
    <BaseDiv
      styles="flex w-[50%] p-[20] bg-[#fff] br-[10] gap-[5] mt-[-150] relative"
      customStyles={{
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10
      }}
      animatable={true}
      animation='bounceIn'
      duration={1500}
    >
      {
        devices.length
          ? <>
            <BaseDiv styles="flex flex-row w-[100%] gap-[5] items-center">
              <BaseText
                styles="color-[rgba(0,0,0,.4)] pl-[3]"
                bold={true}
              >
                Device found
              </BaseText>
    
              <BaseText styles="color-[rgba(0,0,0,.4)] fs-[11]">
                (Tap on a device to connect)
              </BaseText>
            </BaseDiv>

            <BaseDiv styles="w-[100%] mv-[10]">
              <BaseList
                styles="flex gap-[5]"
                data={devices}
                renderItem={
                  useCallback(item => {
                    const list = <BaseAnimatable
                        styles="ph-[10]"
                        animation="bounceInRight"
                        duration={1500}
                        delay={listDelayAnimation.current}
                      >
                        <BaseButton
                          styles={`
                            flex
                            flex-row
                            w-[100%]
                            p-[15]
                            br-[10]
                            items-center
                            justify-center
                            gap-[10]
                            bg-[rgba(0,0,0,.05)]
                          `}
                          gradient={true}
                          gradientColors={['#ffc72b', '#ff971e']}
                          action={() => {
                            connectToPeripheral(item.item)
                            meta.SET_DEVICE(item.item.name)
                          }}
                        >
                          <BaseIcon
                            styles="absolute left-[20] opacity-[.6]"
                            color="#fff"
                            size={22}
                            type="materialicons"
                            name="devices"
                          />

                          <BaseText styles="color-[#fff] fs-[15]">
                            {item.item.name}
                          </BaseText>
                        </BaseButton>
                      </BaseAnimatable>

                    listDelayAnimation.current = listDelayAnimation.current + 250
                    return list
                  }, [connectToPeripheral])
                }
              />
            </BaseDiv>
          </>
        : <BaseDiv styles="flex w-[100%] items-center justify-center">
            <BaseImage
              styles="w-[100] h-[100] opacity-[.2]"
              src={images.searchDevice}
            />

            <BaseText styles="color-[rgba(0,0,0,.4)] mt-[10]">
              Searching for printer devices
            </BaseText>
          </BaseDiv>
      }

      <BaseButton
        styles="absolute top-[5] right-[10]"
        action={onHide}
      >
        <BaseIcon
          type="fontawesome"
          name="close"
          color="rgba(0,0,0,.15)"
          size={20}
        />
      </BaseButton>
    </BaseDiv>
  )
}

export default memo (DeviceConnection)
