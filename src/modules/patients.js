import axios from "@utilities/axios"
import { storage } from "@utilities/helper"

export default () => ({
  metaModule: true,
  name: 'patients',

  metaStates: {
    list: [],
    count: 0
  },
  
  metaMutations: {
    SET_LIST: (state, { payload }) => {
      if (payload) {
        state.list = payload.list
        state.count = payload.count || 0
      }
    }
  },

  metaGetters: {},

  metaActions: {
    async fetch ({ commit }, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)

      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/patients', { params: { data } })
        
        commit('SET_LIST', response.data)
      } catch (error) {
        throw error
      }
    },

    async create ({}, params) {
      try {
        const host = await storage.get('api-host')
        const baseApi = axios(host)

        const response = await baseApi.post('/patients', params)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async patch ({}, params) {
      try {
        const host = await storage.get('api-host')
        const baseApi = axios(host)

        const response = await baseApi.patch('/patients', params)
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
})