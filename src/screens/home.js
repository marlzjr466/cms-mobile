import { memo, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'

// components
import List from '@components/home/list'
import Statistics from '@components/home/statistics'
import Table from '@components/Table'
import InQueue from '@components/home/in-queue'
import Transactions from '@components/home/transactions'

import { useComponent } from '@components'
const {
  BaseText,
  BaseInput,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseIcon,
  BaseGradient
} = useComponent()

// images
import { images } from '@assets/images'

// hooks
import { useAuth } from '@hooks'

function Home () {
  const { auth } = useAuth()

  return (
    <BaseDiv styles="flex-1 bg-[#f9f9f9]">
      <BaseDiv styles="w-full flex-1 flex flex-col mt-[20]">
        <BaseDiv styles="w-full flex flex-row justify-between items-center ph-[30]">
          <BaseDiv styles="flex flex-col gap-[3]">
            <BaseText
              bold={true}
              styles="fs-[18] color-[#3c4447]"
            >
              Welcome back, Athena 👋
            </BaseText>

            <BaseText styles="color-[#3c4447] fs-[13]">
              {moment().format('dddd, MMMM D, YYYY')}
            </BaseText>
          </BaseDiv>

          <BaseButton
            styles="p-[10] flex flex-row items-center gap-[5] br-[5]"
            gradient={true}
            gradientColors={['#ffbf6a', '#ff651a']}
          >
            <BaseIcon
              type="antdesign"
              name="adduser"
              color="#fff"
              size={15}
            />
            <BaseText styles="color-[#fff] fs-[13]">
              Add Patient
            </BaseText>
          </BaseButton>
        </BaseDiv>

        <BaseDiv styles="w-full flex-1 flex flex-row gap-[10] pb-[20] ph-[30] mt-[25]">
          <BaseDiv styles="w-[270] flex flex-col gap-[10]">
            <BaseButton
              styles="w-full h-[170] bg-[#fff] p-[15] br-[10] bw-[1] bc-[#f1f1f1] relative overflow-hidden flex flex-col"
            >
              <BaseIcon 
                styles="absolute bottom-[-50] opacity-[.02]"
                type="antdesign"
                name="barschart"
                color="#000"
                size={300}
              />

              <BaseText bold={true} styles="color-[#3c4447] fs-[14]">
                Current Queue Number
              </BaseText>

              <BaseDiv styles="flex-1 flex justify-center items-center relative">
                <BaseText bold={true} styles="color-[#3c4447] fs-[45]">
                  0013
                </BaseText>
              </BaseDiv>
            </BaseButton>
            
            <Statistics/>
          </BaseDiv>
          
          <Transactions/>
          <InQueue/>
        </BaseDiv>
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo(Home)