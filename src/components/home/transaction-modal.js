import { memo, useState, useCallback, useEffect } from 'react'
import _ from 'lodash'

import { useComponent } from '@components'
import Nodata from '@components/Nodata'
import Loader from '@components/Loader'
const {
	BaseText,
	BaseInput,
	BaseButton,
	BaseDiv,
	BaseImage,
	BaseIcon
} = useComponent()

// hooks
import { useMeta, useToast, useAuth } from '@hooks'

// images
import { images } from '@assets/images'

// utils
import { formatQueueNumber, getAge, formatWithCurrency } from '@utilities/helper'

function TransactionModal ({ data, onAddProduct, onCancel, forUpdate }) {
  const { auth } = useAuth()
  const { show: showToast } = useToast()
  const { metaActions, metaStates, metaMutations } = useMeta()
  
  const [amount, setAmount] = useState(data?.amount || 0)
  const [isProcess, setIsprocess] = useState(false)

  const transactions = {
    ...metaActions('transactions', ['patch'])
  }

  const products = {
    ...metaStates('products', ['items']),
    ...metaMutations('products', ['SET_ITEMS', 'SET_UPDATE_ITEMS']),
    ...metaActions('products', ['patchProductItems'])
  }

  const handleProcess = async () => {
    if (isProcess) {
      return true
    }

    setIsprocess(true)
    try {
      let query = []
      if (!forUpdate) {
        query = products.items.map(item => {
          return products.patchProductItems({
            key: 'id',
            data: {
              id: item.id,
              stock: Number(item.stock) - Number(item.quantity)
            }
          })
        })
      }

      await Promise.all([
        ...query,
        await transactions.patch({
          key: 'id',
          data: {
            id: data?.id,
            attendant_id: auth.attendant_id,
            amount: getTotal(),
            status: 'completed',
            products_metadata: JSON.stringify(products.items)
          }
        })
      ])

      onCancel(true)
      setAmount(0)
      setIsprocess(false)
      showToast('Transaction completed')
    } catch (error) {
      showToast(error.message)
      setIsprocess(false)
    }
  }

  const getSubTotal = useCallback(() => {
    return products.items.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0)
  }, [products.items])

  const getTotal = useCallback(() => {
    return getSubTotal() + Number(data?.consultation_price)
  }, [products.items])

	return (
		<BaseDiv styles="bg-[white] w-[100%] br-[10] flex flex-col">
			<BaseText bold={true} styles="w-full p-[15] bbw-[1] bbc-[rgba(0,0,0,.1)]">
				Process Transaction
			</BaseText>

			<BaseDiv styles="w-full ph-[15] flex flex-col gap-[10]">
        <BaseDiv styles="flex flex-row w-full">
          <BaseDiv styles="flex-1 brw-[1] brc-[rgba(0,0,0,.1)] pr-[10] pv-[10]">
            <BaseDiv styles="w-full flex flex-row gap-[10]">
              <BaseDiv styles="w-[35] h-[35] br-[25]">
                <BaseImage
                  styles="w-full h-full"
                  src={images.patientIcon}
                />
              </BaseDiv>

              <BaseDiv styles="flex h-full flex flex-col">
                <BaseText bold={true} ellipsis={1} styles="color-[#3c4447] fs-[14]">
                  {data?.records?.patients?.first_name} {data?.records?.patients?.last_name}
                </BaseText>
        
                <BaseText styles="fs-[11] color-[#000] opacity-[.5]">
                  {/* {data.records?.patients?.gender ? _.capitalize(data.records?.patients?.gender) : '---'} | {data.records?.patients?.birth_date? getAge(data.records?.patients?.birth_date) : '---'} */}
                  Patient
                </BaseText>
              </BaseDiv>

              <BaseText bold={true} styles="ml-[auto]">
                CMS-{formatQueueNumber(data?.id)}
              </BaseText>
            </BaseDiv>

            <BaseDiv styles="w-full flex flex-col gap-[10] mt-[10]">
              <BaseText styles="fs-[12] opacity-[.7]">
                Served by Dr. {data?.records?.doctors?.first_name} {data?.records?.doctors?.last_name}
              </BaseText>

              <BaseText styles="fs-[10] opacity-[.5]">
                Prescription:
              </BaseText>

              <BaseText styles="fs-[14] mt-[-10] lh-[20]">
                {data?.records?.medication}
              </BaseText>

              {/* <BaseText styles="fs-[10] opacity-[.5]">
                Consultation Price:
              </BaseText>

              <BaseText bold={true} styles="fs-[16] opacity-[.8] mt-[-8]">
                ₱{data.consultation_price}
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
              </BaseDiv> */}
            </BaseDiv>
          </BaseDiv>
          
          <BaseDiv styles="flex-1 pl-[10] pv-[7] flex flex-col">
            <BaseDiv styles="w-full flex flex-row justify-between items-center">
              <BaseText bold={true} styles="">
                Products
              </BaseText>

              <BaseButton
                styles="pv-[5] ph-[10] bg-[rgba(0,0,0,.05)] flex flex-row items-center justify-center gap-[5] br-[5]"
                action={onAddProduct}
              >
                <BaseText styles="color-[rgba(0,0,0,.5)] fs-[11]">
                  Add Product
                </BaseText>
              </BaseButton>
            </BaseDiv>

            <BaseDiv styles="w-full h-[400] pt-[10] pb-[5] flex flex-col justify-center gap-[10] pt-[10]">
              <BaseDiv scrollable styles="w-full flex-1 flex flex-col">
              {
                products.items.length ? (
                  products.items.map((product, i) => (
                    <BaseDiv
                      key={i}
                      styles="w-full flex flex-row gap-[10] p-[5] bbw-[1] bbc-[rgba(0,0,0,.05)]"
                    >
                      <BaseButton
                        styles="opacity-[.5] mt-[3]"
                        action={() => products.SET_ITEMS(product)}
                      >
                        <BaseIcon
                          type="entypo"
                          name="trash"
                          color="#f32e21"
                          size={15}
                        />
                      </BaseButton>

                      <BaseDiv styles="flex flex-col gap-[2]">
                        <BaseText styles="fs-[13]">
                          {product.name}
                        </BaseText>

                        <BaseText styles="fs-[12] opacity-[.4]">
                          {formatWithCurrency(product.price || 0)}
                        </BaseText>

                        <BaseDiv styles="w-[97%] flex flex-row gap-[5] mt-[5] items-center">
                          <BaseButton
                            action={() => {
                              if (product.quantity === 1) {
                                return
                              }

                              const item = {
                                ...product,
                                quantity: product.quantity - 1
                              }

                              products.SET_UPDATE_ITEMS(item)
                            }}
                          >
                            <BaseIcon
                              type="antdesign"
                              name="minussquare"
                              color="rgba(0,0,0,.2)"
                              size={20}
                            />
                          </BaseButton>
                          
                          <BaseInput
                            styles="w-[40] h-[20] br-[5] text-center fs-[12] bw-[1] bc-[rgba(0,0,0,.2)]"
                            type="numeric"
                            value={String(product.quantity)}
                            action={value => {
                              if (value < 1 || value > product.stock) {
                                return
                              }

                              const item = {
                                ...product,
                                quantity: Number(value)
                              }

                              products.SET_UPDATE_ITEMS(item)
                            }}
                          />

                          <BaseButton
                            action={() => {
                              if (product.quantity === product.stock) {
                                return
                              }

                              const item = {
                                ...product,
                                quantity: product.quantity + 1
                              }

                              products.SET_UPDATE_ITEMS(item)
                            }}
                          >
                            <BaseIcon
                              type="antdesign"
                              name="plussquare"
                              color="rgba(0,0,0,.2)"
                              size={20}
                            />
                          </BaseButton>

                          <BaseText styles="ml-[auto] fs-[12] opacity-[.4]">
                            In Stock: {product.stock}
                          </BaseText>
                        </BaseDiv>
                      </BaseDiv>

                      <BaseText bold styles="fs-[14] text-right ml-[auto]">
                        {formatWithCurrency(product.quantity * product.price)}
                      </BaseText>
                    </BaseDiv>
                  ))
                ) : <Nodata />
              }
              </BaseDiv>

              <BaseDiv styles="w-full btw-[2] btc-[rgba(0,0,0,.1)] pt-[5] border-dashed">
                <BaseDiv styles="w-full flex flex-row p-[5] justify-between items-center">
                  <BaseText styles="color-[rgba(0,0,0,.5)] fs-[12]">
                    Subtotal:
                  </BaseText>

                  <BaseText bold styles="color-[rgba(0,0,0,.8)] text-right fs-[12]">
                    {formatWithCurrency(getSubTotal())}
                  </BaseText>
                </BaseDiv>

                <BaseDiv styles="w-full flex flex-row p-[5] justify-between items-center">
                  <BaseText styles="color-[rgba(0,0,0,.5)] fs-[12]">
                    Consultation:
                  </BaseText>

                  <BaseText bold styles="color-[rgba(0,0,0,.8)] text-right fs-[12]">
                    {formatWithCurrency(data?.consultation_price)}
                  </BaseText>
                </BaseDiv>

                <BaseDiv styles="w-full flex flex-row p-[5] justify-between items-center mt-[10]">
                  <BaseText styles="color-[rgba(0,0,0,.5)] fs-[14]">
                    Total:
                  </BaseText>

                  <BaseText bold styles="color-[rgba(0,0,0,.8)] text-right fs-[14]">
                    {formatWithCurrency(getTotal())}
                  </BaseText>
                </BaseDiv>
              </BaseDiv>
            </BaseDiv>
          </BaseDiv>
        </BaseDiv>
			</BaseDiv>

      <BaseDiv styles="w-full flex flex-row gap-[10] p-[15] btw-[1] btc-[rgba(0,0,0,.1)]">
        <BaseButton
          styles="w-[100] p-[10] bg-[rgba(0,0,0,.05)] flex flex-row items-center justify-center gap-[5] br-[7] ml-[auto]"
          action={() => onCancel(forUpdate ? true : false)}
        >
          <BaseText styles="color-[rgba(0,0,0,.5)] fs-[13]">
            Cancel
          </BaseText>
        </BaseButton>

        <BaseButton
          styles="pv-[10] ph-[15] flex flex-row items-center justify-center gap-[5] br-[7]"
          gradient={true}
          gradientColors={['#ffbf6a', '#ff651a']}
          disabled={isProcess}
          action={handleProcess}
        >
          {
            isProcess ? <Loader /> : (
              <BaseText styles="color-[#fff] fs-[13]">
                {
                  forUpdate ? 'Update' : 'Place Order'
                }
              </BaseText>
            )
          }
        </BaseButton>
      </BaseDiv>
		</BaseDiv>
	)
}

export default memo(TransactionModal)