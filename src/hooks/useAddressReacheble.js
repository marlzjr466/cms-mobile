import axios from "axios"

const useAddressReachable = () => {
  return {
    async isReachable (url) {
      try {
        const response = await axios.get(`${url}/health-check`, { timeout: 5000 })
        return {
          success: response.status === 200,
          hostname: response.data.hostname
        }
      } catch (error) {
        return {
          success: false
        }
      }
    }
  }
}

export { useAddressReachable }