import { memo, useState } from 'react'
import moment from 'moment'
import _ from 'lodash'

import { useComponent } from '@components'
import Loader from '@components/Loader'
const {
  BaseText,
  BaseInput,
  BaseButton,
  BaseDiv,
  BaseSelect,
  BaseDatePicker,
  BaseIcon
} = useComponent()

// hooks
import { useModal, useMeta, useToast, useAuth } from '@hooks'

function AddPatientModal ({ defaultData = null }) {
  const { hide } = useModal()
  const { auth } = useAuth()
  const { show: showToast } = useToast()
  const { metaActions } = useMeta()

  const [isSubmit, setIsSubmit] = useState(false)
  const [payload, setPayload] = useState({
    first_name: defaultData?.first_name || null,
    last_name: defaultData?.last_name || null,
    gender: defaultData?.gender || null,
    address: defaultData?.address || null,
    birth_date: defaultData?.birth_date || null
  })

  const patients = {
    ...metaActions('patients', ['create', 'patch'])
  }

  const resetPayload = () => {
    setPayload({
      first_name: null,
      last_name: null,
      gender: null,
      address: null,
      birth_date: null
    })
  }

  const handleSubmit = async () => {
    if (isSubmit) {
      return true
    }

    setIsSubmit(true)
    try {
      if (defaultData) {
        await patients.patch({
          key: 'id',
          data: {
            ...payload,
            birth_date: moment(payload.birth_date).format('YYYY-MM-DD'),
            id: defaultData.id
          }
        })
      } else {
        await patients.create({
          ...payload,
          admin_id: auth.admin_id
        })
      }

      showToast(`Patient ${defaultData ? 'updated' : 'added'} successfully!`)
      setIsSubmit(false)
      resetPayload()
      hide()
    } catch (error) {
      setIsSubmit(false)
      showToast(error.message)
    }
  }

  return (
    <BaseDiv styles="bg-[white] w-[500] br-[10] flex flex-col">
      <BaseText bold={true} styles="w-full p-[15] bbw-[1] bbc-[rgba(0,0,0,.1)]">
        Add Patient
      </BaseText>

      <BaseDiv styles="w-full ph-[15] flex flex-col pv-[20] gap-[10]">
        <BaseDiv styles="w-full flex flex-row gap-[10]">
          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13] ph-[5]">
              First Name
            </BaseText>

            <BaseInput
              styles="w-full h-[40] bc-[rgba(0,0,0,.3)] bw-[1] br-[7] ph-[15] fs-[14]"
              defaultValue={defaultData?.first_name || null}
              action={value => setPayload(prev => ({
                ...prev,
                first_name: value
              }))}
            />
          </BaseDiv>

          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13] ph-[5]">
              Last Name
            </BaseText>

            <BaseInput
              styles="w-full h-[40] bc-[rgba(0,0,0,.3)] bw-[1] br-[7] ph-[15] fs-[14]"
              defaultValue={defaultData?.last_name || null}
              action={value => setPayload(prev => ({
                ...prev,
                last_name: value
              }))}
            />
          </BaseDiv>
        </BaseDiv>

        <BaseDiv styles="w-full flex flex-col gap-[5]">
          <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13] ph-[5]">
            Address
          </BaseText>

          <BaseInput
            styles="w-full h-[40] bc-[rgba(0,0,0,.3)] bw-[1] br-[7] ph-[15] fs-[14]"
              defaultValue={defaultData?.address || null}
            action={value => setPayload(prev => ({
              ...prev,
              address: value
            }))}
          />
        </BaseDiv>

        <BaseDiv styles="w-full flex flex-row gap-[10]">
          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13] ph-[5]">
              Gender
            </BaseText>

            <BaseSelect
              placeholder="Select gender"
              defaultOption={defaultData ? { label: _.capitalize(defaultData?.gender), value: defaultData?.gender } : null}
              options={[
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'}
              ]}
              onChange={option => setPayload(prev => ({
                  ...prev,
                  gender: option.value
                }))
              }
            />
          </BaseDiv>

          <BaseDiv styles="flex-1 flex flex-col gap-[5]">
            <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13] ph-[5]">
              Birth date
            </BaseText>

            <BaseDatePicker
              placeholder="Select birth date"
              defaultDate={defaultData?.birth_date ? new Date(defaultData?.birth_date) : null}
              onChange={date => setPayload(prev => ({ 
                  ...prev,
                  birth_date: moment(date).format('YYYY-MM-DD')
                }))
              }
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
            disabled={isSubmit || Object.values(payload).some(x => !x)}
            action={handleSubmit}
          > 
            {
              isSubmit ? <Loader /> : (
                <BaseText styles="color-[#fff] fs-[13]">
                  {
                    defaultData ? 'Update' : 'Add'
                  }
                </BaseText>
              )
            }
          </BaseButton>
        </BaseDiv>
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo(AddPatientModal)