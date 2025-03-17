import { useEffect } from "react"

const useClickOutside = (ref, fn) => {
  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        fn()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
}

export { useClickOutside }