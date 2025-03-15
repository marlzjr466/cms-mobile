import { memo, useEffect } from 'react'

// components
import { useComponent } from '@components'

function List ({ data }) {
  const { BaseText, BaseDiv } = useComponent()

  return (
    <>
      <BaseText bold={true} styles="color-[#fff] fs-[14] bbw-[1] bbc-[#f3f3f3] pb-[10] ph-[5]">
        In Queue 
      </BaseText>
      
      <BaseDiv scrollable styles="w-full h-full flex flex-col gap-[5]">
          {
            Array.from({ length: 10 }, () => '').map((_, i) => (
              <BaseDiv key={i} styles="flex flex-row items-center pl-[10]">
                <BaseDiv styles="flex-1 flex flex-col pv-[10]">
                  <BaseText styles="fs-[15] color-[#ebfcf6]" bold={true}>
                    John Doe
                  </BaseText>

                  <BaseText styles="fs-[12] color-[#ebfcf6] opacity-[.7]">
                    Male | 21
                  </BaseText>
                </BaseDiv>

                <BaseText bold={true} styles="mr-[10] fs-[12] color-[#000] bg-[#ebfcf6] ph-[10] pv-[5] br-[20]">
                  0001
                </BaseText>
              </BaseDiv>
            ))
          }
      </BaseDiv>
    </>
  )
}

export default memo(List)