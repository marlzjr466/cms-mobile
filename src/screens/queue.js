import { useEffect, memo, useCallback, useState } from 'react'
import { ToastAndroid } from 'react-native';

// utilities
import socket from '@utilities/socket'

// components
import { useComponent } from '@components'
const {
  BaseText,
  BaseIcon,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseGradient,
  BaseSelect
} = useComponent()

// modals
import { useModal } from '@modals'
const { EndQueueing } = useModal()

// images
import { images } from '@assets/images'

// utilities
import { formatQueueNumber, printQueueNumber, getDate } from '@utilities/helper'

function Queue ({ goto }) {
  // meta
  const { metaStates, metaMutations, metaActions } = global.$reduxMeta.useMeta()

  const meta = useCallback({
    ...metaStates('home', [
      'queueNumber',
      'counters',
      'modal'
    ]),
    ...metaMutations('home', ['SET_MODAL']),
    ...metaActions('home', ['getQueueNumber'])
  })

  const [selectedCounter, setSelectedCounter] = useState(null)
  const [currentDate, setCurrentDate] = useState(getDate('MMMM Do YYYY, h:mm:ss a'))

  useEffect(() => {
    socket.on('current-date', date => {
      setCurrentDate(date)
    })
  }, [])

  function showToast(msg) {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }

  return (
    <BaseDiv styles="flex-1 bg-[#fff] ph-[20]">
      <BaseImage
        src={images.contentBG}
        styles="absolute top right w-[300] h-[450] opacity-[.05]"
      />

      <BaseGradient
        styles="flex row-reverse h-[160] bblr-[50] bbrr-[200] absolute top left right overflow-hidden"
        colors={['#fc426f', '#8c52e7']}
        horizontal={true}
      >
        <BaseButton
          styles="absolute top-[40] right-[20] opacity-[.3]"
          action={() => meta.SET_MODAL('endQueueing')}
        >
          <BaseIcon
            styles="fs-[25] color-[#fff]"
            type="fontawesome"
            name="power-off"
          />
        </BaseButton>
      </BaseGradient>

      <BaseImage
        src={images.queueHero}
        styles="w-[180] h-[180] absolute top-[50] right-[20]"
      />

      <BaseDiv styles={`w-[${global.$windowWidth-40}] flex mt-[190] gap-[10]`}>
        <BaseText
          styles="color-[#11335a] fs-[15]"
          bold={true}
        >
          { 'Current\nqueue number' }
        </BaseText>

        <BaseText styles={`w-[${global.$windowWidth-40}] color-[rgba(0,0,0,.5)] fs-[13]`}>
          { currentDate }
        </BaseText>
      </BaseDiv>

      <BaseSelect
        width={global.$windowWidth-40}
        height={45}
        data={meta.counters.map(x => ({ value: `[C${x.id}] ${x.name}`, id: x.id }))}
        label='Choose your counter'
        selected={selectedCounter}
        onChange={data => setSelectedCounter(data)}
      />

      <BaseDiv styles={`w-[${global.$windowWidth-40}] flex pv-[10] gap-[10]`}>
        <BaseGradient
          styles="relative w-[100%] h-[200] flex row items-center justify-center br-[15] p-[20]"
          colors={['#21e7ad', '#3770f5']}
          horizontal={true}
        >
          
          <BaseText
            styles="color-[#fff] fs-[80]"
            bold={true}
          >
            { formatQueueNumber(meta.queueNumber) }
          </BaseText>

          <BaseIcon
            styles="absolute bottom-[-30] right-[-30] fs-[140] color-[#fff] opacity-[.2]"
            type="materialicons"
            name="confirmation-number"
          />
        </BaseGradient>
      </BaseDiv>

      <BaseDiv styles="flex w-[100%] items-center absolute bottom-[30] left-[20]">
        <BaseGradient
          styles="w-[230] h-[60] br-[40] p-[4]"
          customStyles={{ opacity: !selectedCounter ? .5 : 1 }}
          colors={['#ffbf6a', '#ff651a']}
          horizontal={true}
        >
          <BaseButton
            styles="w-[100%] h-[100%] br-[40] bw-[4] bc-[#fff] flex justify-center items-center"
            disabled={!selectedCounter}
            action={async () => {
              try {
                const data = selectedCounter
                setSelectedCounter(null)
                const queueNumber = formatQueueNumber(meta.getQueueNumber())
                const res = await printQueueNumber(queueNumber, data.value)

                if (res) {
                  showToast('Queue number generated.')
                }

                socket.emit('generate-number', {
                  ...data,
                  queue_number: queueNumber
                })
              } catch (error) {
                showToast(`Error: ${error.message}`)
              }
            }}
          >
            <BaseText
              styles="color-[#11335a] opacity-[.7] fs-[15]"
              bold={true}
            >
              Generate number
            </BaseText>
          </BaseButton>
        </BaseGradient>
      </BaseDiv>

      { meta.modal.endQueueing && <EndQueueing goto={goto}/> }
    </BaseDiv>
  )
}

export default memo (Queue)