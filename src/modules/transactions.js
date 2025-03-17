import axios from "@utilities/axios"
import { storage } from "@utilities/helper"

export default () => ({
  metaModule: true,
  name: 'transactions',

  metaStates: {
    list: [],
    count: 0
  },
  
  metaMutations: {
    SET_LIST: (state, { payload }) => {
      if (payload) {
        state.list = payload.list
        state.count = payload.count
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
        const response = await baseApi.get('/transactions', { params: { data } })
        
        commit('SET_LIST', response.data)
      } catch (error) {
        throw error
      }
    },

    async create ({}, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)
        
      try {
        const response = await baseApi.post('/transactions', params)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async patch ({ commit }, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)
        
      try {
        const response = await baseApi.patch('/transactions', params)
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
})