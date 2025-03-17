import { memo, useEffect } from 'react'

import socket from '@utilities/socket'

// components
import { useComponent } from '@components'
import Nodata from '@components/Nodata'

// images
import { images } from '@assets/images'

// utils
import { formatQueueNumber } from '@utilities/helper'


function InQueue ({ data = [], dataCount }) {
  const { BaseText, BaseDiv, BaseImage } = useComponent()
  
  return (
    <BaseDiv styles="flex-1 flex flex-col">
      <BaseDiv styles="w-full flex flex-row bg-[#fff] p-[15] br-[10] bw-[1] bc-[#f1f1f1]">
        <BaseText bold={true} styles=" color-[#3c4447] fs-[14]">
          In Queue
        </BaseText>

        <BaseDiv styles="ml-[auto] bg-[#f45d82] p-[4] br-[5] flex items-center justify-center">
          <BaseText bold={true} styles="color-[#fff] fs-[10]">
            {dataCount}
          </BaseText>
        </BaseDiv>
      </BaseDiv>

      <BaseDiv styles="w-full flex flex-row gap-[5] items-center p-[10]">
        <BaseText styles="w-[60] fs-[12] color-[#000] opacity-[.4]">
          QN
        </BaseText>

        <BaseText styles="w-[150] fs-[12] color-[#000] opacity-[.4]">
          Patient
        </BaseText>

        <BaseText styles="w-[70] ml-[auto] fs-[12] color-[#000] opacity-[.4]">
          Status
        </BaseText>
      </BaseDiv>

      <BaseDiv scrollable styles="flex-1 flex flex-col gap-[5]">
        {
          dataCount ? (
            data.map((item, i) => (
              <BaseDiv key={i} styles="w-full flex flex-row gap-[5] items-center bg-[#fff] h-[45] ph-[10] br-[10] bw-[1] bc-[#f1f1f1]">
                <BaseText bold={true} styles="w-[60] color-[#3c4447] fs-[12]">
                  {formatQueueNumber(item.number)}
                </BaseText>
  
                <BaseDiv styles="w-[150] flex flex-row gap-[10] items-center">
                  <BaseDiv styles="w-[25] h-[25] br-[15]">
                    <BaseImage
                      styles="w-[25] h-[25]"
                      src={item.patients?.gender === 'female' ? images.patientIcon2 : images.patientIcon}
                    />
                  </BaseDiv>
  
                  <BaseText bold={true} ellipsis={1} styles="flex-1 color-[#3c4447] fs-[12]">
                    {item.patients?.first_name} {item.patients?.last_name}
                  </BaseText>
                </BaseDiv>
  
                <BaseText bold={true} styles={`w-[70] ml-[auto] text-center fs-[10] ${item.status === 'in-progress' ? 'color-[#00b142] bg-[#e4fced]' : 'color-[#8162e4] bg-[#e9f0fa]'} ph-[10] pv-[5] br-[20]`}>
                  {item.status === 'in-progress' ? 'ongoing' : item.status}
                </BaseText>
              </BaseDiv>
            ))
          ) : <Nodata label="No data in queue" />
        }
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo(InQueue)