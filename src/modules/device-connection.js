export default () => ({
  metaModule: true,
  name: 'device-connection',

  // states
  metaStates: {
    deviceModal: false
  },

  // mutations
  metaMutations: {
    SET_DEVICE_MODAL: (state, { payload }) => {
      state.deviceModal = payload
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