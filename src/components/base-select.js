import { useState, useEffect } from 'react'

import BaseDiv from './base-div'
import BaseButton from './base-button'
import BaseIcon from './base-icon'
import BaseText from './base-text'

function BaseSelect({ options, placeholder, onChange, defaultOption }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(defaultOption || null)

  return (
    <BaseDiv styles="w-full h-[40] bc-[rgba(0,0,0,.3)] bw-[1] br-[7] ph-[15] relative">
      <BaseButton
        styles="w-full h-full flex flex-row items-center justify-between"
        action={() => setIsOpen(!isOpen)}
      >
        <BaseText styles={`fs-[13] ${selectedOption ? '' : 'color-[rgba(0,0,0,.4)]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </BaseText>

        <BaseIcon
          styles="opacity-[.5]"
          type="fontawesome5"
          name={isOpen ? "angle-up" : "angle-down"}
          color="#000"
          size={18}
        />
      </BaseButton>

      {
        isOpen && (
          <BaseDiv styles="w-[115%] bg-[white] br-[7] absolute left top-[45] flex flex-col overflow-hidden zIndex-[100] bw-[1] bc-[rgba(0,0,0,.1)]">
            {
              options.map((option, i) => (
                <BaseButton
                  key={i}
                  styles="w-full pv-[10] ph-[15]"
                  action={() => {
                    onChange(option)
                    setSelectedOption(option)
                    setIsOpen(false)
                  }}
                >
                  <BaseText styles="fs-[13]">
                    {option.label}
                  </BaseText>
                </BaseButton>
              ))
            }
          </BaseDiv>
        )
      }
    </BaseDiv>
  )
}

export default BaseSelect