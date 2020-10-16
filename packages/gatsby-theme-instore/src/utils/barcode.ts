import KeyboardBarcodeReader, {
  KeyboardHandlerType,
  KeyboardBarcode,
} from './keyboard'
import IotAppManager from './iot'
import * as WebViewBridge from './webView'

type CallbackObject = {
  callback: KeyboardHandlerType
  handleWebViewBridgeEvent: (event: KeyboardBarcode) => any
}

const callbacks: CallbackObject[] = []

function listen(callback: KeyboardHandlerType) {
  KeyboardBarcodeReader.listen(callback)
  IotAppManager.on('CodeReader.read', callback)

  const handleWebViewBridgeEvent = (event: KeyboardBarcode) => {
    if (event.type === 'barcodeRead') {
      callback(event)
    }
  }

  WebViewBridge.listen(handleWebViewBridgeEvent)
  callbacks.push({
    callback,
    handleWebViewBridgeEvent,
  })

  return () => {
    unlisten(callback)
  }
}

function unlisten(callback: KeyboardHandlerType) {
  const callbackIndex = callbacks.findIndex((cur) => cur.callback === callback)
  if (callbackIndex > -1) {
    KeyboardBarcodeReader.unlisten(callback)
    IotAppManager.removeListener('CodeReader.read', callback)
    const { handleWebViewBridgeEvent } = callbacks[callbackIndex]
    WebViewBridge.unlisten(handleWebViewBridgeEvent)
    callbacks.splice(callbackIndex, 1)
  }
}

export default { listen, unlisten }
