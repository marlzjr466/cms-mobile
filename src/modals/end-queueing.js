import { useCallback, memo } from 'react'
import { ToastAndroid } from 'react-native'

// utilities
import socket from '@utilities/socket'

// components
import { useComponent } from '@components'
const {
  BaseText,
  BaseButton,
  BaseDiv,
  BaseModal,
  BaseGradient
} = useComponent()

function EndQueueing ({ goto }) {
  const { metaMutations, metaActions } = global.$reduxMeta.useMeta()

  const meta = useCallback({
    ...metaMutations('home', [
      'SET_MODAL',
      'SET_QUEUE_NUMBER'
    ]),
    ...metaActions('home', ['reset'])
  })
  
  function showToast(msg) {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }

  return (
    <BaseModal styles={`w-[${global.$windowWidth}] h-[100%] bg-[rgba(0,0,0,.3)] absolute ph-[80] zIndex-[2]`}>
      <BaseDiv
        styles="flex w-[100%] p-[20] bg-[#fff] br-[10] top-[250] gap-[5]"
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
        <BaseText
          styles="color-[rgba(0,0,0,.4)] pl-[3] fs-[18] text-center"
          bold={true}
        >
          End queueing?
        </BaseText>

        <BaseDiv styles="flex row w-[100%] gap-[5]">
          <BaseGradient
            styles="w-[50%] h-[40] br-[40] p-[2] mt-[15]"
            colors={['#F8F8F8', '#727272']}
          >
            <BaseButton
              styles="w-[100%] h-[100%] br-[40] bw-[2] bc-[#fff] flex justify-center items-center"
              action={() => meta.SET_MODAL('endQueueing')}
            >
              <BaseText
                styles="color-[#fff] opacity-[.7] fs-[15]"
                bold={true}
              >
                No
              </BaseText>
            </BaseButton>
          </BaseGradient>

          <BaseGradient
            styles="w-[50%] h-[40] br-[40] p-[2] mt-[15]"
            colors={['#ffbf6a', '#ff651a']}
          >
            <BaseButton
              styles="w-[100%] h-[100%] br-[40] bw-[2] bc-[#fff] flex justify-center items-center"
              action={async () => {
                try {
                  await meta.reset()
                  socket.emit('stop-session')

                  meta.SET_MODAL('endQueueing')
                  meta.SET_QUEUE_NUMBER(1)

                  goto({ child: 'home' })
                  showToast('Queueing ended!')
                } catch (error) {
                  showToast(`Error: ${error.message}`)
                }
              }}
            >
              <BaseText
                styles="color-[#fff] opacity-[.7] fs-[15]"
                bold={true}
              >
                Yes
              </BaseText>
            </BaseButton>
          </BaseGradient>
        </BaseDiv>
      </BaseDiv>
    </BaseModal>
  )
}

export default memo(EndQueueing)