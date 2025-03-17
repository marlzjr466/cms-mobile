import axios from "@utilities/axios"
import { storage } from "@utilities/helper"

export default () => ({
  metaModule: true,
  name: 'queues',

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
        const response = await baseApi.get('/queues', { params: { data } })
        
        commit('SET_LIST', response.data)
      } catch (error) {
        throw error
      }
    },

    async create ({}, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)
    
      try {
        const response = await baseApi.post('/queues', params)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async patch ({ commit }, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)
    
      try {
        const response = await baseApi.patch('/queues', params)
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
})