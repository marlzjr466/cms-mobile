import { memo, useState, useEffect } from 'react'

import socket from '@utilities/socket'

// composable
import { headers } from '@composable/patients'
import { filters } from '@composable/filters'

// hooks
import { useMeta, useModal } from '@hooks'

// components
import Table from '@components/Table'
import AddPatientModal from '@components/home/add-patient-modal'
import { useComponent } from '@components'
const {
  BaseDiv,
} = useComponent()

function Patients () {
  const { setPage, pagination, sort, page } = filters()
  const { metaStates, metaActions } = useMeta()
  const { show } = useModal()

  const patients = {
    ...metaStates('patients', ['list', 'count']),
    ...metaActions('patients', ['fetch'])
  }

  const [init, setInit] = useState(true)
  const [updatedData, setUpdatedData] = useState(null)

  useEffect(() => {
    socket.on('refresh', types => {
      if (types.includes('patients')) {
        loadPatients()
      }
    })

    return () => setInit(true)
  }, [])

  useEffect(() => {
    loadPatients()
  }, [page])

  useEffect(() => {
    if (!init) {
      showPatientModal()
    }
  }, [updatedData])

  const loadPatients = async (data = null) => {
    const filters = [
      {
        field: 'patients.deleted_at',
        value: 'null'
      }
    ]

    if (data) {
      filters.push(...[
        {
          field: 'patients.first_name',
          operator: 'like',
          value: data
        },
        {
          field: 'patients.last_name',
          operator: 'orlike',
          value: data
        }
      ])
    }

    await patients.fetch({
      filters,
      leftJoin: [
        {
          raw: `
            (
              SELECT * FROM records 
              WHERE id = (
                SELECT id FROM records r2 
                WHERE r2.patient_id = records.patient_id 
                ORDER BY created_at DESC 
                LIMIT 1
              )
            ) AS records
          `,
          field: 'records.patient_id',
          key: 'patients.id'
        }
      ],
      columns: [
        'patients.*',
        {
          raw: `
            JSON_OBJECT(
              'id', records.id,
              'created_at', records.created_at
            ) AS records
          `
        }
      ],
      groupBy: ['patients.id', 'records.id'],
      is_count: true,
      pagination,
      sort: [
        { field: 'records.created_at', direction: 'desc' },
        { field: 'patients.id', direction: 'desc' },
      ]
    })
  }

  const showPatientModal = () => show(<AddPatientModal defaultData={updatedData} />)

  return (
    <BaseDiv styles="flex-1 bg-[#f9f9f9] p-[20] flex flex-col gap-[10]">
      <Table
        headers={headers}
        data={patients.list}
        totalDataCount={patients.count} // Normally, this should be the total count from API
        currentPage={page}
        onPageChange={page => setPage(page)}
        itemsPerPage={pagination.rows}
        onSearch={data => loadPatients(data)}
        onRefresh={() => loadPatients()}
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
        addButton={{
          label: 'Add Patient',
          icon: {
            type: 'antdesign',
            name: 'adduser'
          }
        }}
      />
    </BaseDiv>
  )
}

export default memo(Patients)