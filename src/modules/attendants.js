import axios from "@utilities/axios"
import { storage } from "@utilities/helper"

export default () => ({
  metaModule: true,
  name: 'attendants',

  metaStates: {
    profile: null
  },
  
  metaMutations: {
    SET_PROFILE: (state, { payload }) => {
      if (payload) {
        state.profile = payload
      }
    }
  },

  metaGetters: {},

  metaActions: {
    async patch ({}, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)
    
      try {
        const response = await baseApi.patch('/attendants', params)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async getProfile ({ commit }, id) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)
    
      try {
        const params = {
          is_first: true,
          filters: [
            {
              field: 'id',
              value: id
            }
          ]
        }

        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/attendants', { params: { data } })
        
        commit('SET_PROFILE', response.data)
      } catch (error) {
        throw error
      }
    }
  }
})