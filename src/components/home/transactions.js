import { memo, useEffect, useState } from 'react'

// components
import { useComponent } from '@components'
import Nodata from '@components/Nodata'

// images
import { images } from '@assets/images'

// utils
import { formatQueueNumber } from '@utilities/helper'

// hooks
import { useMeta, useToast } from '@hooks'

function Transactions ({ data, dataCount, onView }) {
  const { BaseText, BaseDiv, BaseButton, BaseImage } = useComponent()
  const { show } = useToast()
  const { metaActions } = useMeta()

  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (activeId) {
      handleView()
    }
  }, [activeId])

  const txn = {
    ...metaActions('transactions', ['patch'])
  }

  const handleView = async () => {
    try {
      await txn.patch({
        key: 'id',
        data: {
          id: activeId,
          status: 'ongoing'
        }
      })
    } catch (error) {
      show(error.message)
    }
  }
  
  return (
    <BaseDiv styles="flex-1 flex flex-col">
      <BaseDiv styles="w-full flex flex-row bg-[#fff] p-[15] br-[10] bw-[1] bc-[#f1f1f1]">
        <BaseText bold={true} styles=" color-[#3c4447] fs-[14]">
          For Transactions
        </BaseText>

        <BaseDiv styles="ml-[auto] bg-[#f45d82] p-[4] br-[5] flex items-center justify-center">
          <BaseText bold={true} styles="color-[#fff] fs-[10]">
            {dataCount}
          </BaseText>
        </BaseDiv>
      </BaseDiv>

      <BaseDiv styles="w-full flex flex-row gap-[5] items-center p-[10]">
        <BaseText styles="w-[70] fs-[12] color-[#000] opacity-[.4]">
          TXN ID
        </BaseText>

        <BaseText styles="w-[150] fs-[12] color-[#000] opacity-[.4]">
          Patient
        </BaseText>

        <BaseText styles="w-[50] ml-[auto] fs-[12] color-[#000] opacity-[.4]">
          Action
        </BaseText>
      </BaseDiv>

      <BaseDiv scrollable styles="flex-1 flex flex-col gap-[5]">
        {
          dataCount ? (
            data.map((item, i) => (
              <BaseDiv key={i} styles="w-full flex flex-row gap-[5] items-center bg-[#fff] h-[45] ph-[10] br-[10] bw-[1] bc-[#f1f1f1]">
                <BaseText bold={true} styles="w-[70] color-[#3c4447] fs-[12]">
                  CMS-{formatQueueNumber(item.id)}
                </BaseText>
  
                <BaseDiv styles="w-[170] flex flex-row gap-[10] items-center">
                  <BaseDiv styles="w-[25] h-[25] br-[15]">
                    <BaseImage
                      styles="w-[25] h-[25]"
                      src={item.records?.patients?.gender === 'female' ? images.patientIcon2 : images.patientIcon}
                    />
                  </BaseDiv>
  
                  <BaseText bold={true} ellipsis={1} styles="flex-1 color-[#3c4447] fs-[12]">
                    {item.records?.patients?.first_name} {item.records?.patients?.last_name}
                  </BaseText>
                </BaseDiv>
  
                <BaseButton
                  styles="w-[60]"
                  action={() => {
                    setActiveId(item.id)
                    onView(item)
                  }}
                >
                  <BaseText bold={true} styles={`w-[50] text-center ml-[auto] fs-[10] color-[#009ad8] bg-[#eaf9ff] ph-[10] pv-[5] br-[20]`}>
                    View
                  </BaseText> 
                </BaseButton>
              </BaseDiv>
            ))
          ) : <Nodata label="No data in transactions" />
        }
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo(Transactions)