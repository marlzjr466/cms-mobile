import axios from "@utilities/axios"
import { storage } from "@utilities/helper"

export default () => ({
  metaModule: true,
  name: 'products',

  metaStates: {
    categories: [],
    items: [],
    variants: [],
    items: []
  },
  
  metaMutations: {
    SET_ITEMS: (state, { payload }) => {
      const isItemExist = state.items.some(x => x.id === payload.id)
      
      const newItems = isItemExist 
        ? state.items.filter(x => x.id !== payload.id)
        : [...state.items, payload]

      state.items = newItems.sort((a, b) => a.id - b.id)
    },

    SET_ITEMS_CLEAR: (state) => {
      state.items = []
    },

    SET_INIT_ITEMS: (state, { payload }) => {
      state.items = payload
    },

    SET_UPDATE_ITEMS: (state, { payload }) => {
      state.items = [
        ...state.items.filter(x => x.id !== payload.id),
        payload 
      ].sort((a, b) => a.id - b.id)
    },

    SET_CATEGORIES: (state, { payload }) => {
      if (payload) {
        state.categories = payload.list
      }
    },

    SET_VARIANTS: (state, { payload }) => {
      if (payload) {
        state.variants = payload.list
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
        const response = await baseApi.get('/products', { params: { data } })
        
        return response.data
      } catch (error) {
        throw error
      }
    },

    async fetchCategories ({ commit }, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)

      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/categories', { params: { data } })
        
        commit('SET_CATEGORIES', response.data)
      } catch (error) {
        throw error
      }
    },

    async fetchProductItems ({ commit }, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)

      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/product-items', { params: { data } })
        
        return response.data
      } catch (error) {
        throw error
      }
    },

    async fetchProductVariants ({ commit }, params) {
      const host = await storage.get('api-host')
      const baseApi = axios(host)

      try {
        const data = btoa(JSON.stringify(params))
        const response = await baseApi.get('/product-variants', { params: { data } })
        
        commit('SET_VARIANTS', response.data)
      } catch (error) {
        throw error
      }
    },
    
    async patchProductItems ({}, params) {
      try {
        const host = await storage.get('api-host')
        const baseApi = axios(host)

        const response = await baseApi.patch('/product-items', params)
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
})