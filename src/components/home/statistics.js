import { memo, useEffect } from 'react'

// components
import { useComponent } from '@components'

// utils
import { formatWithCurrency } from '@utilities/helper'

// composable
import { statisticsList } from '@composable/statistics'

function Statistics () {
  const { BaseText, BaseDiv, BaseGradient, BaseIcon } = useComponent()

  return (
    <BaseDiv styles="w-full flex flex-col gap-[5]">
      <BaseText bold={true} styles="pv-[5] color-[#3c4447]">
        Today's Statistics
      </BaseText>
      {
        statisticsList.map((item, i) => (
          <BaseGradient
            key={i}
            styles="w-full h-[80] br-[15] p-[15] relative"
            colors={item.colors}
            horizontal={true}
          >
            <BaseText styles="color-[white] fs-[14]">
              {item.label}
            </BaseText>

            <BaseText bold={true} styles="color-[white] fs-[25] mt-[5]">
              {item.label === 'Sales' ? formatWithCurrency(item.value) : item.value}
            </BaseText>

            <BaseIcon
              styles="absolute right-[-5] bottom-[-10] opacity-[.2]"
              type={item.icon.type}
              name={item.icon.name}
              color="#fff"
              size={80}
            />

            {
              item.label === 'Sales' && (
                <BaseIcon
                  styles="absolute right-[-25] bottom-[-15] opacity-[.2]"
                  type={item.icon.type}
                  name={item.icon.name}
                  color="#fff"
                  size={70}
                /> 
              )
            }
          </BaseGradient>
        ))
      }      
    </BaseDiv>
  )
}

export default memo(Statistics)