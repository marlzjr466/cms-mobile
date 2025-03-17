import axios from "@utilities/axios"
import { storage } from "@utilities/helper"
import moment from "moment"

export default () => ({
  metaModule: true,
  name: 'statistics',

  metaStates: {
    patientCount: 0,
    txnCount: 0,
    sales: 0
  },
  
  metaMutations: {
    SET_STATISTICS: (state, { payload }) => {
      if (payload) {
        state.patientCount = payload.patientCount
        state.txnCount = payload.txnCount
        state.sales = payload.sales
      }
    }
  },

  metaGetters: {},

  metaActions: {
    async fetch ({ commit }, { attendant_id }) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)
        
      try {
        const params = {
          filters: [
            {
              field: 'updated_at',
              custom_operator: 'dateequal',
              value: moment().format('YYYY-MM-DD')
            }
          ],
          columns: ['id'],
          is_count: true
        }
        const data = btoa(JSON.stringify(params))
        const txnData = btoa(JSON.stringify({
          ...params,
          filters: [
            ...params.filters,
            {
              field: 'status',
              value: 'completed'
            },
            {
              field: 'attendant_id',
              value: attendant_id
            }
          ],
          columns: ['id', 'amount']
        }))

        const [{data: patient}, {data: txn}] = await Promise.all([
          baseApi.get('/records', { params: { data } }),
          baseApi.get('/transactions', { params: { data: txnData } })
        ])

        const totalAmount = txn?.list?.reduce((acc, cur) => acc + Number(cur.amount), 0)

        commit('SET_STATISTICS', {
          patientCount: patient?.count || 0,
          txnCount: txn?.count || 0,
          sales: totalAmount || 0
        })
      } catch (error) {
        console.log('error', error)
        throw error
      }
    },
  }
})