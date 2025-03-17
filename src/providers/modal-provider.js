import { useState, memo } from "react"

import { ModalContext } from "@context/modal"
import { useComponent } from '@components'

function ModalProvider ({ children }) {
  const { BaseModal } = useComponent()
  const [modalContent, setModalContent] = useState(null)

  const show = content => setModalContent(content)
  const hide = () => setModalContent(null)

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}

      <BaseModal visible={modalContent !== null}>
        {modalContent}
      </BaseModal>
    </ModalContext.Provider>
  )
}

export default memo(ModalProvider)