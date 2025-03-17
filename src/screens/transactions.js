import { memo, useState, useEffect } from 'react'

import socket from '@utilities/socket'

// composable
import { headers } from '@composable/transactions'
import { filters } from '@composable/filters'

// hooks
import { useMeta, useModal } from '@hooks'

// components
import Table from '@components/Table'
import TransactionModal from '@components/home/transaction-modal'
import { useComponent } from '@components'
const {
  BaseDiv,
} = useComponent()

function Transactions () {
  const { setPage, pagination, sort, page } = filters()
  const { metaStates, metaActions } = useMeta()
  const { show } = useModal()

  const transactions = {
    ...metaStates('transactions', ['list', 'count']),
    ...metaActions('transactions', ['fetch'])
  }

  const [init, setInit] = useState(true)
  const [updatedData, setUpdatedData] = useState(null)

  useEffect(() => {
    socket.on('refresh', types => {
      if (types.includes('transactions')) {
        loadTransactions()
      }
    })

    return () => setInit(true)
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [page])

  useEffect(() => {
    if (!init) {
      showPatientModal()
    }
  }, [updatedData])

  const loadTransactions = async () => {
    await transactions.fetch({
      filters: [
        {
          field: 'deleted_at',
          value: 'null'
        }
      ],
      columns: ['id', 'record_id', 'status', 'amount'],
      aggregate: [
        {
          table: 'records',
          filters: [
            {
              field: 'id',
              key: 'record_id'
            }
          ],
          is_first: true,
          columns: ['medication', 'diagnosis', 'patient_id', 'doctor_id'],
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
              columns: ['first_name', 'last_name', 'gender', 'birth_date'],
            },
            {
              table: 'doctors',
              filters: [
                {
                  field: 'id',
                  key: 'doctor_id'
                }
              ],
              is_first: true,
              columns: ['first_name', 'last_name'],
            }
          ]
        }
      ],
      is_count: true,
      pagination,
      sort
    })
  }

  const showPatientModal = () => show(<TransactionModal data={updatedData} forUpdate />)

  return (
    <BaseDiv styles="flex-1 bg-[#f9f9f9] p-[20] flex flex-col gap-[10]">
      <Table
        headers={headers}
        data={transactions.list}
        totalDataCount={transactions.count} // Normally, this should be the total count from API
        currentPage={page}
        onPageChange={page => setPage(page)}
        itemsPerPage={pagination.rows}
        onCreate={() => {
          if (init) {
            showPatientModal()
          } else {
            setUpdatedData(null)
          }
        }}
        onRowClick={row => {
          setInit(false)
          setUpdatedData(row)
        }}
        disableActions
      />
    </BaseDiv>
  )
}

export default memo(Transactions)