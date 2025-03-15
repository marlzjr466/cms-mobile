import SetupConnection from "@modals/setup-connection"
import DeviceConnection from "@modals/device-connection"
import AddCounter from "@modals/add-counter"
import EndQueueing from "@modals/end-queueing"

export const useModal = () => ({
  SetupConnection,
  DeviceConnection,
  AddCounter,
  EndQueueing
})
