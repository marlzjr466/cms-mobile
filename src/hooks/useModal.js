import { useContext } from 'react'

// context
import { ModalContext } from '@context/modal'

const useModal = () => {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModal must be used within the ModalProvider')
  }
  return context
}

export { useModal }