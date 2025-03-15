import axios from "@utilities/axios"
import { storage } from "@utilities/helper"

export default () => ({
  metaModule: true,
  name: 'auth',

  // states
  metaStates: {
    auth: null
  },

  // mutations
  metaMutations: {
    SET_AUTH: (state, { payload }) => {
      state.auth = payload
    }
  },

  // getters
  metaGetters: {},

  // actions
  metaActions: {
    async login ({}, params) {
      try {
        const host = await storage.get('api-host')
        const baseApi = axios(host)

        const response = await baseApi.post('/authentications/login', params)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async logout ({}, params) {
      try {
        const host = await storage.get('api-host')
        const baseApi = axios(host)

        const response = await baseApi.post('/authentications/logout', params)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async changePassword ({}, params) {
      try {
        const host = await storage.get('api-host')
        const baseApi = axios(host)

        const response = await baseApi.patch('/authentications/change-password', params)
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
})