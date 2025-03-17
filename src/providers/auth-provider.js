import { useState, useEffect, memo } from "react"

// hooks
import { useStorage, useMeta, useToast } from "@hooks"

// context
import { AuthContext } from "@context/auth"

// utilities
import { decodeToken } from "@utilities/helper"

function AuthProvider ({ children }) {
  const toast = useToast()
  const storage = useStorage()
  const { metaActions } = useMeta()
  
  const [auth, setAuth] = useState(null)

  const authentications = {
    ...metaActions('auth', ['login', 'logout'])
  }

  useEffect(() => {
    const loadToken = async () => {
      const token = await storage.get('token')

      if (token) {
        setAuth(decodeToken(token))
      }
    }

    loadToken()
  }, [])

  const login = async ({ username, password }, callback) => {
    try {
      const res = await authentications.login({
        username,
        password,
        role: 'attendant'
      })

      setAuth(decodeToken(res.token))
      storage.set('token', res.token)
      toast.show('Login successful!')

      if (callback) {
        callback()
      }
    } catch (error) {
      console.log('error:', error.message)
      toast.show(error.message)
    }
  }

  const logout = async callback => {
    try {
      const res = await authentications.logout({
        user_id: auth.id
      })

      if (res === 'OK') {
        await storage.remove('token')
        setAuth(null)

        if (callback) {
          callback()
        }
      }
    } catch (error) {
      console.log('error:', error.message)
      toast.show(error.message)
    }
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default memo(AuthProvider)