import { memo, useState, useEffect } from 'react'
import _ from 'lodash'

import { formatWithCurrency } from '@utilities/helper'
import { useComponent } from '@components'
import Nodata from '@components/Nodata'

const {
	BaseText,
	BaseInput,
	BaseButton,
	BaseDiv,
	BaseImage,
	BaseIcon
} = useComponent()

// hooks
import { useMeta, useToast, useAuth, useModal } from '@hooks'

function ProductsModal ({ onHide, onSelectedItem }) {
  const { auth } = useAuth()
  const { show: showToast } = useToast()
  const { metaStates, metaActions } = useMeta()

  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [searchString, setSearchString] = useState(null)
  const [activeCategory, setActiveCategory] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const products = {
    ...metaStates('products', ['categories', 'items']),
    ...metaActions('products', ['fetch', 'fetchProductItems'])
  }

  useEffect(() => {
    if (!searchString) {
      loadProducts(null, null, 1)
    }
  }, [activeCategory])

  useEffect(() => {
    if (isLoading && page) {
      loadProducts(null, true)
    }
  }, [page, isLoading])

  const handleSearch = () => {
    loadProducts(true, null, 1)
    setActiveCategory(0)
  }

  const onInfiniteScroll = () => {
    setIsLoading(true)
    setPage(prev => prev + 1)
  }

  const loadProducts = async (onSearch, onScroll, curPage) => {
    if (curPage) {
      setPage(1)
    }

    try {
      const filters = [
        {
          field: 'product_items.deleted_at',
          value: 'null'
        }
      ]

      if (searchString) {
        filters.push({
          field: 'products.name',
          operator: 'like',
          value: searchString
        })
      }

      if (activeCategory && !onSearch) {
        filters.push({
          field: 'products.category_id',
          value: activeCategory
        })
      }

      const list = await products.fetchProductItems({
        filters,
        leftJoin: [
          {
            table: 'products',
            field: 'products.id',
            key: 'product_items.product_id'
          }
        ],
        columns: [
          'product_items.*',
          {
            raw: `
              JSON_OBJECT(
                'id', products.id,
                'name', products.name,
                'created_at', product_items.created_at
              ) AS items
            `
          }
        ],
        groupBy: ['products.id', 'product_items.id'],
        pagination: { rows: 20, page: curPage || page }
      })

      onScroll ? setData(prev => [...prev, ...list ]) : setData(list)
      setSearchString(null)
      setIsLoading(false)
    } catch (error) {
      showToast(error.message)
    }
  }

  return (
    <BaseDiv styles="bg-[white] w-[100%] br-[10] flex flex-col relative">
			<BaseText bold={true} styles="w-full p-[15] bbw-[1] bbc-[rgba(0,0,0,.1)]">
				Products
			</BaseText>

      <BaseButton styles="absolute top-[5] right-[5] zIndex-[10]" action={onHide}>
        <BaseIcon
          type="fontawesome"
          name="times-circle"
          color="rgba(0,0,0,.2)"
          size={25}
        />
      </BaseButton>

      <BaseDiv styles="w-full flex flex-row h-[500]">
        <BaseDiv styles="w-[250] h-full pv-[10] brw-[1] brc-[rgba(0,0,0,.1)] flex flex-col gap-[10]">
          <BaseText bold styles="ph-[10]">
            Categories
          </BaseText>

          <BaseDiv scrollable styles="w-full flex-1 pb-[10]">
            <BaseButton
              styles="opacity-[.5] ph-[15] pv-[10] bbw-[1] bbc-[rgba(0,0,0,.1)]"
              action={() => {
                setActiveCategory(0)
              }}
            >
              <BaseText bold={!activeCategory} styles={`fs-[12] ${!activeCategory ? 'color-[#ff651a]' : ''}`}>
                All
              </BaseText>
            </BaseButton>

            {
              products.categories?.map((item, i) => (
                <BaseButton
                  key={i} 
                  styles="opacity-[.5] ph-[15] pv-[10] bbw-[1] bbc-[rgba(0,0,0,.1)]"
                  action={() => {
                    setActiveCategory(item.id)
                  }}
                >
                  <BaseText
                    bold={activeCategory === item.id}
                    styles={`fs-[12] ${activeCategory === item.id ? 'color-[#ff651a]' : ''}`}
                  >
                    {item.name}
                  </BaseText>
                </BaseButton>
              ))
            }
          </BaseDiv>
        </BaseDiv>

        <BaseDiv styles="flex-1 flex flex-col">
          <BaseDiv styles="w-full p-[10] flex flex-row gap-[5]">
            <BaseInput
              styles="flex-1 h-[40] bw-[1] bc-[rgba(0,0,0,.1)] fs-[14] br-[7] ph-[15]"
              placeholder="Search product here..."
              value={searchString}
              action={value => setSearchString(value)}
            />

            <BaseButton
              styles="w-[100] h-[40] flex flex-row items-center justify-center gap-[5] br-[7]"
              gradient
              gradientColors={['#ffbf6a', '#ff651a']}
              action={handleSearch}
            >
              <BaseText styles="color-[#fff] fs-[13]">
                Search
              </BaseText>
            </BaseButton>
          </BaseDiv>

          <BaseDiv
            scrollable
            onInfiniteScroll={onInfiniteScroll}
            styles="w-full flex-1 flex flex-row flex-wrap gap-[5] ph-[10] pb-[10]"
          >
            {
              data.length ? (
                data.map((product, i) => (
                  <BaseButton
                    key={i}
                    styles={`w-[48%] p-[10] bw-[1] ${products.items?.find(x => x.id === product.id) ? 'bc-[#04e88b]' : 'bc-[rgba(0,0,0,.05)]'} br-[10] flex flex-col relative`}
                    // disabled={!product.stock}
                    action={() => {
                      onSelectedItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                        quantity: 1
                      })
                    }}
                  >
                    {
                      products.items?.find(x => x.id === product.id) && (
                        <BaseIcon
                          styles="absolute top-[5] right-[5]"
                          type="materialcommunityicons"
                          name="check-decagram"
                          color="#04e88b"
                          size={18}
                        />
                      )
                    }

                    <BaseDiv styles="w-full flex flex-row gap-[10]">
                      <BaseIcon
                        type="fontawesome5"
                        name="capsules"
                        color="rgba(0,0,0,.2)"
                        size={30}
                      />

                      <BaseDiv styles="flex flex-col flex-1 gap-[8]">
                        <BaseText bold styles="fs-[12] opacity-[.7]">
                          {product.name}
                        </BaseText>

                        <BaseDiv styles="w-full flex flex-row justify-between">
                          <BaseText styles="fs-[12] opacity-[.6]">
                            {formatWithCurrency(product.price)}
                          </BaseText>

                          <BaseText styles={`fs-[12] ${!product.stock ? 'color-[red] opacity-[.4]' : 'opacity-[.6]'}`}>
                            {product.stock ? `In Stock: ${product.stock}` : 'Out of stock'}
                          </BaseText>
                        </BaseDiv>
                      </BaseDiv>
                    </BaseDiv>
                  </BaseButton>
                ))
              ) : <Nodata />
            }

            {
              isLoading && (
                <BaseText styles="w-full p-[15] opacity-[.4] fs-[12] text-center">
                  Loading more products...
                </BaseText>
              )
            }
          </BaseDiv>
        </BaseDiv>
      </BaseDiv>
    </BaseDiv>
  )
}

export default memo(ProductsModal)