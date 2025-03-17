import { memo, useState } from 'react'
import _ from 'lodash'

import { useComponent } from '@components'
const {
	BaseText,
	BaseInput,
	BaseButton,
	BaseDiv,
	BaseImage,
	BaseIcon
} = useComponent()

// hooks
import { useModal, useMeta, useToast, useAuth } from '@hooks'

// images
import { images } from '@assets/images'

// utils
import { formatQueueNumber, getAge } from '@utilities/helper'

function TransactionModal ({ data, forUpdate }) {
  const { auth } = useAuth()
	const { hide } = useModal()
  const { show: showToast } = useToast()
  const { metaActions } = useMeta()
  
  const [amount, setAmount] = useState(data?.amount || 0)

  const transactions = {
    ...metaActions('transactions', ['patch'])
  }

  const handleProcess = async () => {
    try {
      await transactions.patch({
        key: 'id',
        data: {
          id: data.id,
          attendant_id: auth.attendant_id,
          amount,
          status: 'completed'
        }
      })

      hide()
      setAmount(0)
      showToast('Transaction completed')
    } catch (error) {
      showToast(error.message)
    }
  }

	return (
		<BaseDiv styles="bg-[white] w-[400] br-[10] flex flex-col">
			<BaseText bold={true} styles="w-full p-[15] bbw-[1] bbc-[rgba(0,0,0,.1)]">
				Process Transaction
			</BaseText>

			<BaseDiv styles="w-full ph-[15] flex flex-col pv-[20] gap-[10]">
				<BaseDiv styles="w-full flex flex-row gap-[10]">
					<BaseDiv styles="w-[40] h-[40] br-[25]">
						<BaseImage
							styles="w-full h-full"
							src={images.patientIcon}
						/>
					</BaseDiv>

					<BaseDiv styles="flex h-full flex flex-col">
						<BaseText bold={true} ellipsis={1} styles="color-[#3c4447] fs-[14]">
              {data.records?.patients?.first_name} {data.records?.patients?.last_name}
						</BaseText>

						<BaseText styles="fs-[11] color-[#000] opacity-[.5]">
              {_.capitalize(data.records?.patients?.gender)} | {getAge(data.records?.patients?.birth_date)}
						</BaseText>
					</BaseDiv>

					<BaseText bold={true} styles="ml-[auto]">
						CMS-{formatQueueNumber(data.id)}
					</BaseText>
				</BaseDiv>

				<BaseDiv styles="w-full flex flex-col gap-[10]">
					<BaseText styles="fs-[12] opacity-[.7]">
						Served by Dr. {data.records?.doctors?.first_name} {data.records?.doctors?.last_name}
					</BaseText>

					<BaseText styles="fs-[10] opacity-[.5]">
						Prescription:
					</BaseText>

					<BaseText styles="fs-[13] mt-[-10]">
						{data.records?.medication}
					</BaseText>

					<BaseText styles="fs-[10] opacity-[.5]">
						Amount:
					</BaseText>
					
					<BaseDiv styles="w-full relative flex flex-row items-center gap-[10] h-[40] bc-[rgba(0,0,0,.3)] bw-[1] br-[7] ph-[10] mt-[-8]">
						<BaseText bold={true} styles="fs-[16] opacity-[.3]">
							₱
						</BaseText>

						<BaseInput
              defaultValue={data?.amount || null}
							styles="flex-1 h-full fs-[14]"
							placeholder="Enter amount here"
							type="numeric"
							action={value => setAmount(value)}
						/>
					</BaseDiv>
				</BaseDiv>

				<BaseDiv styles="w-full flex flex-row gap-[10] mt-[10]">
					<BaseButton
						styles="w-[100] p-[10] bg-[rgba(0,0,0,.05)] flex flex-row items-center justify-center gap-[5] br-[7] ml-[auto]"
						action={hide}
					>
						<BaseText styles="color-[rgba(0,0,0,.5)] fs-[13]">
							Cancel
						</BaseText>
					</BaseButton>

					<BaseButton
						styles="w-[100] p-[10] flex flex-row items-center justify-center gap-[5] br-[7]"
						gradient={true}
						gradientColors={['#ffbf6a', '#ff651a']}
            disabled={!amount}
						action={handleProcess}
					>
						<BaseText styles="color-[#fff] fs-[13]">
            {
              forUpdate ? 'Update' : 'Process'
            }
						</BaseText>
					</BaseButton>
				</BaseDiv>
			</BaseDiv>
		</BaseDiv>
	)
}

export default memo(TransactionModal)