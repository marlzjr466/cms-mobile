import { memo, useState } from 'react'
import moment from 'moment'
import _ from 'lodash'

import Nodata from './Nodata'
import { useComponent } from '@components'
const {
  BaseText,
  BaseInput,
  BaseButton,
  BaseImage,
  BaseDiv,
  BaseGradient,
  BaseIcon
} = useComponent()

import { images } from '@assets/images'
import { formatWithCurrency } from '@utilities/helper'

const Table = ({ headers, data, totalDataCount, currentPage, onPageChange, onSearch, onRowClick, onRefresh, onCreate, itemsPerPage = 10, addButton, disableActions }) => {
  const totalPages = Math.ceil(totalDataCount / itemsPerPage)
  const maxPageButtons = 5
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

  const [searchString, setSearchString] = useState(null)

  const extractValue = (item, key) => {
    const keys = key.split('.')
    const value = keys.reduce((acc, cur) => acc?.[cur], item)
    return value
  }

  const getValue = (item, header) => {
    
    if (Array.isArray(header.key)) {
      const combined = header.key.map(hk => {
        return extractValue(item, hk)
      }).join(' ')

      return combined
    }

    const value = extractValue(item, header.key)
    if (header.format) {
      return moment(value).format(header.format)
    }

    if (header.capitalize) {
      return _.capitalize(value)
    }

    if (header.currency) {
      return formatWithCurrency(value)
    }

    return value
  }

  return (
    <BaseDiv styles="flex-1 flex flex-col">
      {
        !disableActions && (
          <BaseDiv styles="w-full flex flex-row justify-between gap-[5] mb-[20]">
            <BaseDiv styles="flex flex-row gap-[5]">
              <BaseButton
                styles="w-[40] h-[40] bg-[white] bw-[1] bc-[#f1f1f1] flex items-center justify-center br-[7]"
                action={() => {
                  setSearchString(null)
                  onRefresh()
                }}
              >
                <BaseIcon
                  styles="opacity-[.5]"
                  type="feather"
                  name="refresh-ccw"
                  color="#000"
                  size={17}
                />
              </BaseButton>

              <BaseDiv styles="h-[40] bg-[white] bw-[1] bc-[#f1f1f1] flex flex-row items-center justify-center br-[7]">
                <BaseInput
                  styles="h-full w-[250] fs-[12] ph-[10]"
                  placeholder="Type something here..."
                  action={value => setSearchString(value)}
                />
                <BaseButton
                  styles="w-[30] h-[30] bg-[rgba(0,0,0,.05)] flex flex-row items-center justify-center gap-[5] br-[5] mr-[4] mt-[0]"
                  action={() => onSearch(searchString)}
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
            </BaseDiv>

            <BaseButton
              styles="h-[38] ph-[15] flex flex-row items-center gap-[5] br-[7]"
              gradient={true}
              gradientColors={['#ffbf6a', '#ff651a']}
              action={onCreate}
            >
              <BaseIcon type={addButton.icon.type} name={addButton.icon.name} color="#fff" size={15} />
              <BaseText styles="color-[#fff] fs-[13]">{addButton.label}</BaseText>
            </BaseButton>
          </BaseDiv>
        )
      }

      <BaseDiv styles="w-full flex flex-row gap-[5] items-center h-[35] ph-[20] opacity-[.5]">
        {headers.map((header, j) => (
          <BaseText key={j} styles={`${header.width ? `w-[${header.width}]` : 'flex-1'} color-[#3c4447] fs-[12]`}>
            {header.column}
          </BaseText>
        ))}
      </BaseDiv>

      <BaseDiv scrollable styles="flex-1 flex flex-col gap-[5]">
        {data.length ? (
          data.map((item, i) => (
            <BaseButton
              key={i}
              styles="w-full flex flex-row gap-[5] items-center bg-[#fff] h-[45] ph-[20] br-[10] bw-[1] bc-[#f1f1f1]"
              action={() => onRowClick(item)}
            >
              {headers.map((header, j) => (
                <BaseDiv key={j} styles={`${header.width ? `w-[${header.width}]` : 'flex-1'} gap-[10] flex flex-row items-center`}>
                  {
                    header.avatar && (
                      <BaseImage
                        styles="w-[25] h-[25]"
                        src={extractValue(item, header.avatarKey) === 'female' ? images.patientIcon2 : images.patientIcon}
                      />
                    )
                  }

                  <BaseText ellipsis={1} key={j} styles="color-[#3c4447] fs-[12]">
                    {getValue(item, header)}
                  </BaseText>
                </BaseDiv>
              ))}
            </BaseButton>
          ))
        ) : (
          <Nodata label="No available data" />
        )}
      </BaseDiv>
      
      {
        totalPages > 1 ? (
          <BaseDiv styles="flex flex-row items-center justify-center h-[50] gap-[5] mt-[10]">
            <BaseButton 
              styles="w-[35] h-[35] bg-[white] bw-[1] bc-[#f1f1f1] flex items-center justify-center br-[7]" 
              disabled={currentPage === 1}
              action={() => onPageChange(currentPage - 1)}
            >
              <BaseIcon styles="opacity-[.4]" type="fontawesome5" name="angle-left" color="#000" size={17} />
            </BaseButton>

            {Array.from({ length: endPage - startPage + 1 }).map((_, i) => (
              <BaseButton
                key={startPage + i}
                styles={`w-[35] h-[35] ${currentPage === startPage + i ? 'bg-[#629dfa]' : 'bg-[white]'} bw-[1] bc-[#f1f1f1] flex items-center justify-center br-[7]`}
                action={() => onPageChange(startPage + i)}
              >
                <BaseText styles={`fs-[13] ${currentPage === startPage + i ? 'color-[white]' : 'color-[rgba(0,0,0,.4)]'}`}>{startPage + i}</BaseText>
              </BaseButton>
            ))}

            <BaseButton 
              styles="w-[35] h-[35] bg-[white] bw-[1] bc-[#f1f1f1] flex items-center justify-center br-[7]" 
              disabled={currentPage === totalPages} 
              action={() => onPageChange(currentPage + 1)}
            >
              <BaseIcon styles="opacity-[.4]" type="fontawesome5" name="angle-right" color="#000" size={17} />
            </BaseButton>
          </BaseDiv>
        ) : null
      }
    </BaseDiv>
  )
}

export default memo(Table)