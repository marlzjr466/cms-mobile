export default () => ({
  metaModule: true,
  name: 'host',

  // states
  metaStates: {
    address: null
  },

  // mutations
  metaMutations: {
    SET_ADDRESS: (state, { payload }) => {
      state.address = payload
    }
  },

  // getters
  metaGetters: {},

  // actions
  metaActions: {}
})