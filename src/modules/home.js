import axios from "@utilities/axios"

export default () => ({
  metaModule: true,
  name: 'home',

  // states
  metaStates: {
    deviceName: null
  },

  // mutations
  metaMutations: {
    SET_DEVICE: (state, { payload }) => {
      state.deviceName = payload
    }
  },

  // getters
  metaGetters: {},

  // actions
  metaActions: {}
})