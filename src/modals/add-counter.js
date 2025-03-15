import { useState, useCallback, memo } from 'react'
import { ToastAndroid } from 'react-native'

// components
import { useComponent } from '@components'
const {
  BaseText,
  BaseButton,
  BaseDiv,
  BaseModal,
  BaseInput,
  BaseGradient
} = useComponent()

function showToast(msg) {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
}

function AddCounter () {
  const { metaStates, metaMutations, metaActions } = global.$reduxMeta.useMeta()

  const meta = useCallback({
    ...metaStates('home', ['setup']),

    ...metaMutations('home', [
      'SET_MODAL',
      'SET_COUNTERS_COUNT'
    ]),

    ...metaActions('home', ['addCounter'])
  })
  
  const [counterName, setCounterName] = useState('')

  return (
    <BaseModal styles={`w-[${global.$windowWidth}] h-[100%] bg-[rgba(0,0,0,.3)] absolute ph-[80]`}>
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
          styles="color-[rgba(0,0,0,.4)] pl-[3]"
          bold={true}
        >
          Counter name:
        </BaseText>

        <BaseInput
          styles="w-[100%] h-[40] bc-[rgba(255,151,30,.3)] bw-[1] br-[20] ph-[10] fs-[15]"
          action={value => setCounterName(value)}
        />

        <BaseDiv styles="flex row w-[100%] gap-[5]">
          <BaseGradient
            styles="w-[50%] h-[40] br-[40] p-[2] mt-[15]"
            colors={['#F8F8F8', '#727272']}
          >
            <BaseButton
              styles="w-[100%] h-[100%] br-[40] bw-[2] bc-[#fff] flex justify-center items-center"
              action={() => meta.SET_MODAL('addCounter')}
            >
              <BaseText
                styles="color-[#fff] opacity-[.7] fs-[15]"
                bold={true}
              >
                Cancel
              </BaseText>
            </BaseButton>
          </BaseGradient>

          <BaseGradient
            styles="w-[50%] h-[40] br-[40] p-[2] mt-[15]"
            customStyles={{
              opacity: counterName === '' ? .5 : 1
            }}
            colors={['#ffbf6a', '#ff651a']}
          >
            <BaseButton
              styles="w-[100%] h-[100%] br-[40] bw-[2] bc-[#fff] flex justify-center items-center"
              disabled={counterName === ''}
              action={async () => {
                await meta.addCounter({
                  name: counterName
                })

                meta.SET_MODAL('addCounter')
                setCounterName('')
                showToast('Added successfully!')
              }}
            >
              <BaseText
                styles="color-[#fff] opacity-[.7] fs-[15]"
                bold={true}
              >
                Add counter
              </BaseText>
            </BaseButton>
          </BaseGradient>
        </BaseDiv>
      </BaseDiv>
    </BaseModal>
  )
}

export default memo(AddCounter)