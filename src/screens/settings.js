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

function Settings () {
  return (
    <BaseDiv styles="flex-1 bg-[#fff]">
      <BaseText
        styles="color-[#11335a] fs-[24]"
        bold={true}
      >
        Settings Screen
      </BaseText>
    </BaseDiv>
  )
}

export default memo(Settings)