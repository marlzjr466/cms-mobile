import { memo,useState } from 'react'
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

import Nodata from '@components/Nodata'

// hooks
import { useModal, useToast, useMeta, useAuth, useStorage } from '@hooks'

// images
import { images } from '@assets/images'

// utils
import { getAge, formatQueueNumber } from '@utilities/helper'

function GenerateQueueNumber ({ number, onGenerate }) {
  const { auth } = useAuth()
  const { hide } = useModal()
  const { show: showToast } = useToast()
  const { metaStates, metaActions } = useMeta()
  const storage = useStorage()

  const [searchString, setSearchString] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const patients = {
    ...metaStates('patients', ['list', 'count']),
    ...metaActions('patients', ['fetch'])
  }

  const queues = {
    ...metaActions('queues', ['create'])
  }

  const handlePatientSearch = async () => {
    try {
      await patients.fetch({
        filters: [
          {
            field: 'admin_id',
            value: auth.admin_id
          },
          {
            field: 'deleted_at',
            value: 'null'
          },
          {
            field: 'first_name',
            operator: 'like',
            value: searchString
          },
          {
            field: 'last_name',
            operator: 'orlike',
            value: searchString
          }
        ],
        is_count: true,
        sort: [{ field: 'created_at', direction: 'desc' }]
      })
    } catch (error) {
      showToast(error.message)
    }
  }

  const handleGenerateQueue = async () => {
    try {
      const current = await storage.get('current-number')
      const next = Number(current) + 1

      await queues.create({
        number: current,
        patient_id: selectedPatient.id,
        attendant_id: auth.attendant_id
      })

      // process print queue number here
      // with thermal printer

      hide()
      onGenerate(next)
      setSelectedPatient(null)
      showToast(`Queue number ${formatQueueNumber(current)} generated`)
    } catch (error) {
      showToast(error.message)
    }
  }

  return (
    <BaseDiv styles="bg-[white] w-[400] br-[10] flex flex-col">
      <BaseText bold={true} styles="w-full p-[15] bbw-[1] bbc-[rgba(0,0,0,.1)]">
        Generate Queue Number - {number}
      </BaseText>

      <BaseDiv styles="w-full ph-[15] flex flex-col pv-[20] gap-[10]">
        <BaseDiv styles="w-full flex flex-row gap-[10] h-[40] bc-[rgba(0,0,0,.3)] bw-[1] br-[7] pl-[15] pr-[5]">
          <BaseInput
            styles="flex-1 h-full fs-[13]"
            placeholder="Search patient here"
            action={value => setSearchString(value)}
          />

          <BaseButton
            styles="w-[30] h-[30] bg-[rgba(0,0,0,.05)] flex flex-row items-center justify-center gap-[5] br-[5] mt-[4]"
            action={handlePatientSearch}
          >
            <BaseIcon
              styles="opacity-[.3]"
              type="feather"
              name="search"
              color="#000"
              size={14}
            />
          </BaseButton>
        </BaseDiv>

        <BaseDiv styles="w-full maxH-[300]">
          <BaseDiv scrollable styles="w-full flex-1 flex flex-col gap-[5]">
            {
              patients.count ? (
                patients?.list.map((patient, i) => (
                  <BaseButton
                    key={i}
                    styles={`w-full flex flex-row gap-[5] items-center bg-[#fff] h-[55] ph-[10] br-[10] ${selectedPatient?.id === patient.id ? 'bw-[2] bc-[#27df9a]' : 'bw-[1] bc-[#f1f1f1]'}`}
                    action={() => setSelectedPatient(patient)}
                  >
                    <BaseDiv styles="w-full flex flex-row gap-[10] items-center">
                      <BaseDiv styles="w-[30] h-[30] br-[15]">
                        <BaseImage
                          styles="w-full h-full"
                          src={patient.gender === 'female' ? images.patientIcon2 : images.patientIcon}
                        />
                      </BaseDiv>
  
                      <BaseDiv styles="flex h-full flex flex-col">
                        <BaseText bold={true} ellipsis={1} styles="color-[#3c4447] fs-[12]">
                          {patient.first_name} {patient.last_name}
                        </BaseText>
  
                        <BaseText styles="fs-[10] color-[#000] opacity-[.5]">
                          {_.capitalize(patient.gender)} | {getAge(patient.birth_date)}
                        </BaseText>
                      </BaseDiv>
  
                      {
                        selectedPatient?.id === patient.id && (
                          <BaseIcon
                            styles="ml-[auto]"
                            type="ionicons"
                            name="checkmark-circle"
                            color="#27df9a"
                            size={20}
                          />
                        )
                      }
                    </BaseDiv>
                  </BaseButton>
                ))
              ) : <Nodata label="No patient found" />
            }
          </BaseDiv>
        </BaseDiv>
        
        <BaseDiv styles="w-full flex flex-row gap-[10] mt-[10]">
          <BaseButton
            styles="w-[100] p-[10] bg-[rgba(0,0,0,.05)] flex flex-row items-center justify-center gap-[5] br-[7] ml-[auto]"
            action={() => {
              setSelectedPatient(null)
              hide()
            }}
          >
            <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13]">
              Cancel
            </BaseText>
          </BaseButton>

          <BaseButton
            styles="w-[100] p-[10] flex flex-row items-center justify-center gap-[5] br-[7]"
            gradient={true}
            gradientColors={['#ffbf6a', '#ff651a']}
            disabled={!selectedPatient}
            action={handleGenerateQueue}
          >
            <BaseText styles="color-[#fff] fs-[13]">
              Generate
            </BaseText>
          </BaseButton>
        </BaseDiv>
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo(GenerateQueueNumber)