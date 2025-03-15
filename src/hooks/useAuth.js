import { useContext } from 'react'

// context
import { AuthContext } from '@context/auth'

const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within the AuthProvider')
  }
  return context
}

export { useAuth }