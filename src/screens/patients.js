import { memo } from 'react'

// components
import { useComponent } from '@components'
const {
  BaseText,
  BaseInput,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseGradient
} = useComponent()

function Patients () {
  return (
    <BaseDiv styles="flex-1 bg-[#fff]">
      <BaseText
        styles="color-[#11335a] fs-[24]"
        bold={true}
      >
        Patients Screen
      </BaseText>
    </BaseDiv>
  )
}

export default memo(Patients)