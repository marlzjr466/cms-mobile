import axios from "@utilities/axios"

export default () => ({
  metaModule: true,
  name: 'home',

  // states
  metaStates: {
    queueNumber: 1,
    counters: [],
    header: {
      greetings: 'Queueing\nManagement\nSystem',
      message: "Deliver a high-quality services and improve citizens' waiting experience."
    },

    setup: [
      {
        title: 'CONNECTION',
        host: '',
        buttonText: 'Setup connection',
        background: ['#21e7ad', '#3770f5'],
        icon: {
          type: 'materialicons',
          name: 'wifi-tethering'
        }
      },
      {
        title: 'COUNTERS',
        counters: 0,
        buttonText: 'Add counter',
        background: ['#ff7764', '#f7a13d'],
        icon: {
          type: 'antdesign',
          name: 'appstore-o'
        }
      },
      {
        title: 'PRINTER',
        device: '',
        buttonText: 'Setup printer',
        background: ['#fc426f', '#8c52e7'],
        icon: {
          type: 'antdesign',
          name: 'printer'
        }
      }
    ],

    modal: {
      addCounter: false,
      setupConnection: false,
      setupPrinter: false,
      endQueueing: false
    }
  },

  // mutations
  metaMutations: {
    SET_QUEUE_NUMBER: (state, { payload }) => {
      state.queueNumber = payload
    },

    SET_MODAL: (state, { payload }) => {
      state.modal[payload] = !state.modal[payload]
    },

    SET_COUNTERS_COUNT: (state, { payload }) => {
      state.setup[1].counters = payload
    },

    SET_COUNTERS: (state, { payload }) => {
      state.counters = payload
    },

    SET_HOST: (state, { payload }) => {
      state.setup[0].host = payload
    },

    SET_DEVICE: (state, { payload }) => {
      state.setup[2].device = payload
    }
  },

  // getters
  metaGetters: {},

  // actions
  metaActions: {
    getQueueNumber ({ commit, state }) {
      const activeQueueNumber = state.queueNumber

      commit('SET_QUEUE_NUMBER', activeQueueNumber + 1)
      return activeQueueNumber
    },

    async addCounter ({ dispatch }, params) {
      const host = await global.$localStorage.getItem('host')
      const baseApi = axios(host)

      try {
        await baseApi.post('/cms/counters/create', params)
        dispatch({ action: 'getCounters' })
      } catch (error) {
        throw error
      }
    },

    async getCounters ({ commit }) {
      const host = await global.$localStorage.getItem('host')
      const baseApi = axios(host)

      try {
        const res = await baseApi.post('/cms/counters/list')

        commit('SET_COUNTERS', res.data)
        commit('SET_COUNTERS_COUNT', res.data.length)
      } catch (error) {
        throw error
      }
    },

    async reset ({ commit }) {
      const host = await global.$localStorage.getItem('host')
      const baseApi = axios(host)

      try {
        await baseApi.post('/cms/reset')
      } catch (error) {
        throw error
      }
    }
  }
})