import { useState, useEffect } from 'react'

import BaseDiv from './base-div'
import BaseButton from './base-button'
import BaseIcon from './base-icon'
import BaseText from './base-text'

function BaseSelect({ data, label, width, height, onChange, selected: selectedItem }) {
  const [selected, setSelected] = useState(label)
  const [selectState, setSelectState] = useState(false)

  useEffect(() => {
    if (!selectedItem) {
      setSelected(label)
      setSelectState(false)
    }
  }, [selectedItem])

  return(
    <>
      <BaseDiv
        styles={`
          w-[${width || 200}]
          h-[${height || 35}]
          bw-[1]
          bc-[rgba(0,0,0,.3)]
          ph-[10]
          br-[10]
          relative
          mt-[30]
          zIndex-[1]
        `}>
        <BaseButton
          styles='h-[100%] flex justify-center'
          action={() => {
            const state = selectState ? false : true
            setSelectState(state)
          }}
        >
          <BaseText>{selected}</BaseText>
        </BaseButton>

        <BaseIcon
          styles='absolute top-[12] right-[10]'
          type="fontawesome"
          name={ selectState ? "angle-up" : "angle-down" }
          size={18}
        />

        {
          selectState ?
            <BaseDiv
              styles={`
                w-[${width ? width - 10 : 190}]
                bg-[#fff]
                p-[10]
                flex
                col
                absolute
                top-[${height ? height + 2 : 37}]
                left-[5]
                bw-[1]
                bc-[rgba(0,0,0,.1)]
                zIndex-[10]
              `}
            >
              {
                data.map((item, key) => {
                  return(
                    <BaseButton
                      key={key}
                      styles='w-[100%] p-[10]'
                      action={() => {
                        setSelected(item.value)
                        setSelectState(false)
                        onChange(item)
                      }}
                    >
                      <BaseText styles={`color-[${item.value == selected ? '#F49531' : 'rgba(0,0,0,.4)'}]`}>{item.value}</BaseText>
                    </BaseButton>
                  )
                })
              }
            </BaseDiv> : ''
        }
      </BaseDiv>
    </>
  )
}

export default BaseSelect