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

function Table () {
  return (
    <BaseDiv styles="w-full flex flex-col">
      <BaseDiv styles="bg-[#fff] p-[15] br-[10] bw-[1] bc-[#f1f1f1]">
        <BaseText bold={true} styles="color-[#3c4447] fs-[14]">
          Today's Patients 
        </BaseText>
      </BaseDiv>

      <BaseDiv styles="w-full ">
      
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo(Table)