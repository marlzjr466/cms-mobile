import { memo } from 'react'

import { useComponent } from '@components'
const {
  BaseText,
  BaseButton,
  BaseDiv
} = useComponent()

// hooks
import { useModal } from '@hooks'

function ConfirmAlert ({ onConfirm }) {
  const { hide } = useModal()

  return (
    <BaseDiv styles="bg-[white] w-[350] br-[10] flex flex-col p-[20] gap-[30]">
      <BaseText bold={true} styles="w-full text-center fs-[16]">
        Are you sure to end the queue?
      </BaseText>

      <BaseDiv styles="w-full flex flex-row justify-center gap-[10]">
        <BaseButton
          styles="w-[80] p-[10] bg-[rgba(0,0,0,.05)] flex flex-row items-center justify-center gap-[5] br-[7]"
          action={hide}
        >
          <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13]">
            Cancel
          </BaseText>
        </BaseButton>

        <BaseButton
          styles="w-[80] p-[10] flex flex-row items-center justify-center gap-[5] br-[7]"
          gradient={true}
          gradientColors={['#ffbf6a', '#ff651a']}
          action={onConfirm}
        >
          <BaseText styles="color-[#fff] fs-[13]">
            Yes
          </BaseText>
        </BaseButton>
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo(ConfirmAlert)