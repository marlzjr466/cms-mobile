import { useState } from 'react'
import moment from 'moment'
import DateTimePicker from "@react-native-community/datetimepicker"

import BaseDiv from './base-div'
import BaseButton from './base-button'
import BaseIcon from './base-icon'
import BaseText from './base-text'

function BaseDatePicker({ placeholder, onChange, defaultDate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(defaultDate || new Date())

  const onSelect = (_, date) => {
    setIsOpen(false)
    if (date) {
      setSelectedDate(date)
      onChange(date)
    }
  }

  return (
    <BaseDiv styles="w-full h-[40] bc-[rgba(0,0,0,.3)] bw-[1] br-[7] ph-[15] relative">
      <BaseButton
        styles="w-full h-full flex flex-row items-center justify-between"
        action={() => setIsOpen(!isOpen)}
      >
        <BaseText styles={`fs-[13] ${selectedDate ? '' : 'color-[rgba(0,0,0,.4)]'}`}>
          {selectedDate ? moment(selectedDate).format('MMM DD, YYYY') : placeholder}
        </BaseText>

        <BaseIcon
          styles="opacity-[.5]"
          type="fontawesome"
          name="calendar"
          color="#000"
          size={16}
        />
      </BaseButton>

      {
        isOpen && (
          <BaseDiv styles="w-[115%] bg-[white] br-[7] absolute left top-[45] flex flex-col overflow-hidden zIndex-[100] bw-[1] bc-[rgba(0,0,0,.1)]">
            <DateTimePicker 
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onSelect}
            />
          </BaseDiv>
        )
      }
    </BaseDiv>
  )
}

export default BaseDatePicker