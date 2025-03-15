import { ToastAndroid } from 'react-native'

const useToast = () => {
  return {
    show (msg, type = 'SHORT') {
      ToastAndroid
        .showWithGravity(msg, ToastAndroid?.[type], ToastAndroid.CENTER)
    }
  }
}

export { useToast }