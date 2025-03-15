import axios from 'axios'
import _ from 'lodash'

import { storage } from './helper'

export default api = address => {
  const instance = axios.create({
    baseURL: `${address}:3000`,
    timeout: 10000
  })

  instance.interceptors.request.use(async config => {
    const token = await storage.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
    return config
  })

  const successResponse = response => {
    const status = _.get(response, 'status')
    const customMessage = `${_.toUpper(response.config.method)} ${response.config.url}`

    if (status !== 200) {
      throw new Error(`Client responded with a status: "${status}" on ${customMessage}`)
    }

    return response
  }

  const errorResponse = err => {
    throw new Error(err.response.data)
  }

  instance.interceptors.response.use(
    successResponse,
    errorResponse
  )

  return instance
}