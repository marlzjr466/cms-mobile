const useStorage = () => {
  return {
    set (key, value) {
      global.$localStorage.setItem(key, value)
    },
  
    async get (key) {
      return await global.$localStorage.getItem(key)
    },

    async remove (key) {
      await global.$localStorage.removeItem(key)
    }
  }
}

export { useStorage }