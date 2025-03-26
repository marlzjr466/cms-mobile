import { memo, useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'

import socket from '@utilities/socket'

// components
import List from '@components/home/list'
import Statistics from '@components/home/statistics'
import Table from '@components/Table'
import InQueue from '@components/home/in-queue'
import Transactions from '@components/home/transactions'
import AddPatientModal from '@components/home/add-patient-modal'
import GenerateQueueNumber from '@components/home/generate-queue-number'
import TransactionModal from '@components/home/transaction-modal'
import ProductsModal from '@components/home/products'
import ConfirmAlert from '@components/home/confirm-alert'
import Nodata from '@components/Nodata'

import { useComponent } from '@components'
const {
  BaseText,
  BaseButton,
  BaseDiv,
  BaseIcon,
} = useComponent()

// hooks
import { useAuth, useModal, useStorage, useMeta, useToast, useDevice } from '@hooks'

// utils
import { formatQueueNumber } from '@utilities/helper'

function Home () {
  const storage = useStorage()
  const { connectedDevice } = useDevice()
  const { auth } = useAuth()
  const { show, hide } = useModal()
  const { show: showToast } = useToast()
  const { metaStates, metaActions, metaMutations } = useMeta()

  const [startQueue, setStartQueue] = useState(false)
  const [currentQueueNumber, setCurrentQueueNumber] = useState(1)
  const [currentViewTxn, setCurrentViewTxn] = useState(null)
  const [onTxnCancelId, setOnTxnCancelId] = useState(null)

  const meta = {
    ...metaStates('home', ['deviceName'])
  }

  const queues = {
    ...metaStates('queues', ['count', 'list']),
    ...metaActions('queues', ['fetch'])
  }

  const transactions = {
    ...metaStates('transactions', ['pendingCount', 'pendingList']),
    ...metaActions('transactions', ['fetchPending', 'patch'])
  }

  const statistics = {
    ...metaStates('statistics', ['patientCount', 'txnCount', 'sales']),
    ...metaActions('statistics', ['fetch'])
  }

  const products = {
    ...metaMutations('products', ['SET_ITEMS', 'SET_ITEMS_CLEAR']),
    ...metaActions('products', ['setItems', 'fetch', 'fetchCategories', 'fetchProductItems', 'fetchProductVariants'])
  }

  useEffect(() => {
    async function init() {
      const [isQueueStarted, currentNumber] = await Promise.all([
        storage.get('queue-started'),
        storage.get('current-number')
      ])

      setStartQueue(eval(isQueueStarted))
      setCurrentQueueNumber(Number(currentNumber) || 1)
    }

    init()
    loadInQueue()
    loadTransactions()
    loadStatistics()
    loadCategories()

    socket.on('refresh', types => {
      if (types.includes('queues')) {
        loadInQueue()
      }

      if (types.includes('transactions')) {
        loadTransactions()
      }

      loadStatistics()
    })

    return () => {
      // socket.off('refresh-inqueue')
    }
  }, [])

  useEffect(() => {
    if (currentViewTxn) {
      showTransactionModal()
    }
  }, [currentViewTxn])

  useEffect(() => {
    storage.set('current-number', String(currentQueueNumber))
  }, [currentQueueNumber])

  useEffect(() => {
    storage.set('queue-started', String(startQueue))
  }, [startQueue])

  const loadCategories = async () => {
    await products.fetchCategories({
      filters: [
        {
          field: 'deleted_at',
          value: 'null'
        }
      ],
      is_count: true
    })
  }

  const loadInQueue = async () => {
    try {
      await queues.fetch({
        filters: [
          {
            field: 'deleted_at',
            value: 'null'
          },
          {
            field: 'status',
            operator: 'in',
            value: ['waiting', 'in-progress']
          }
        ],
        aggregate: [
          {
            table: 'patients',
            filters: [
              {
                field: 'id',
                key: 'patient_id'
              }
            ],
            is_first: true,
            columns: ['first_name', 'last_name', 'gender']
          }
        ],
        is_count: true
      })
    } catch (error) {
      showToast(error.message)
    }
  }

  const loadTransactions = async () => {
    try {
      await transactions.fetchPending()
    } catch (error) {
      showToast(error.message)
    }
  }

  const loadStatistics = async () => {
    try {
      await statistics.fetch({
        attendant_id: auth.attendant_id
      })
    } catch (error) {
      showToast(error.message)
    }
  }

  const handleCancelTxn = async isCompleted => {
    try {
      if (!isCompleted) {
        await transactions.patch({
          key: 'id',
          data: {
            id: onTxnCancelId,
            status: 'pending'
          }
        })
      }

      setOnTxnCancelId(null)
      products.SET_ITEMS_CLEAR()
    } catch (error) {
      show(error.message)
    }
  }

  const showPatientModal = () => show(<AddPatientModal/>)
  const showTransactionModal = () => show(
    <TransactionModal
      data={currentViewTxn}
      onAddProduct={showProductsModal}
      onCancel={async isCompleted => {
        handleCancelTxn(isCompleted)
        setCurrentViewTxn(null)
        hide()
      }}
    />
  )
  const showProductsModal = () => show(
    <ProductsModal
      onHide={showTransactionModal}
      onSelectedItem={item => {
        products.SET_ITEMS(item)
      }}
    />
  )
  const showGenerateQueueModal = () => show(
    <GenerateQueueNumber
      number={formatQueueNumber(currentQueueNumber)}
      onGenerate={number => setCurrentQueueNumber(number)}
    />
  )

  const conFirmAlert = () => show(
    <ConfirmAlert
      message="Are you sure to end the queue?"
      onConfirm={() => {
        setStartQueue(false)
        setCurrentQueueNumber(1)
        hide()
      }}
    />
  )

  return (
    <>
      <BaseDiv styles="flex-1 bg-[#f9f9f9]">
        <BaseDiv styles="w-full flex-1 flex flex-col mt-[20]">
          <BaseDiv styles="w-full flex flex-row items-center ph-[30]">
            <BaseDiv styles="flex flex-col gap-[3]">
              <BaseText
                bold={true}
                styles="fs-[18] color-[#3c4447]"
              >
                Welcome back, {auth?.first_name} 👋
              </BaseText>

              <BaseText styles="color-[#3c4447] fs-[13]">
                {moment().format('dddd, MMMM D, YYYY')}
              </BaseText>
            </BaseDiv>

            <BaseDiv styles="ml-[auto] flex flex-row gap-[10]">
              <BaseButton
                styles="p-[10] flex flex-row items-center gap-[5] br-[5]"
                gradient={true}
                gradientColors={['#ffbf6a', '#ff651a']}
                action={() => {
                  if (startQueue) {
                    return conFirmAlert()
                  }

                  // if (!meta.deviceName) {
                  //   return showToast('Please connect to a thermal printer before starting the queue.', 'LONG')
                  // }

                  setStartQueue(true)
                }}
              >
                <BaseIcon
                  type="fontawesome"
                  name={!startQueue ? "hourglass-start" : "hourglass-end"}
                  color="#fff"
                  size={12}
                />
                  <BaseText styles="color-[#fff] fs-[13]">
                    {
                      !startQueue ? 'Start Queue' : 'End Queue'
                    }
                  </BaseText>
              </BaseButton>

              <BaseButton
                styles="p-[10] flex flex-row items-center gap-[5] br-[5]"
                gradient={true}
                gradientColors={['#ffbf6a', '#ff651a']}
                action={showPatientModal}
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

          </BaseDiv>

          <BaseDiv styles="w-full flex-1 flex flex-row gap-[10] pb-[20] ph-[30] mt-[25]">
            <BaseDiv styles="w-[270] flex flex-col gap-[10]">
              <BaseButton
                styles="w-full h-[170] bg-[#fff] p-[15] br-[10] bw-[1] bc-[#f1f1f1] relative overflow-hidden flex flex-col"
                action={showGenerateQueueModal}
                disabled={!startQueue}
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
                    {
                      !startQueue ? '----' : formatQueueNumber(currentQueueNumber)
                    }
                  </BaseText>
                </BaseDiv>
              </BaseButton>
              
              <Statistics
                patientCount={statistics.patientCount}
                txnCount={statistics.txnCount}
                sales={statistics.sales}
              />
            </BaseDiv>
            
            <Transactions
              data={transactions?.pendingList}
              dataCount={transactions?.pendingCount}
              onView={txn => {
                setCurrentViewTxn(txn)
                setOnTxnCancelId(txn.id)
              }}
            />
            <InQueue data={queues?.list} dataCount={queues?.count}/>
          </BaseDiv>
        </BaseDiv>
      </BaseDiv>
    </>
  )
}

export default memo(Home)