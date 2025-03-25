export default () => ({
  metaModule: true,
  name: 'device-connection',

  // states
  metaStates: {
    deviceModal: false,
    devices: []
  },

  // mutations
  metaMutations: {
    SET_DEVICE_MODAL: (state, { payload }) => {
      state.deviceModal = payload
    },

    SET_DEVICES: (state, { payload }) => {
      state.devices = payload.filter(item => item.name)
    }
  },

  // getters
  metaGetters: {
    getDeviceModal (state) {
      return state.deviceModal
    }
  },

  // actions
  metaActions: {
    showDeviceModal ({ commit }, status) {
      commit('SET_DEVICE_MODAL', status)
    },
    
    testDevice ({ commit, state }, args) {
      console.log('testDevice:', args)
    } 
  }
})