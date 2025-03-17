import { memo } from 'react'

// components
import { useComponent } from '@components'
const {
  BaseText,
  BaseIcon,
  BaseButton,
  BaseImage,
  BaseDiv
} = useComponent()

function Nodata ({ label = 'No data' }) {
  return (
    <BaseDiv styles="w-full flex flex-col items-center opacity-[.1] gap-[10] p-[30]">
      <BaseIcon
        type="fontawesome5"
        name="file-medical-alt"
        color="#000"
        size={40}
      />

      <BaseText bold={true} styles="color-[#000]">
        {label}
      </BaseText>
    </BaseDiv>
  )
}

export default memo(Nodata)