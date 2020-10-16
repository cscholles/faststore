import transmitter from 'transmitter'
import safeStringify from 'fast-safe-stringify'

import { KeyboardBarcode } from './keyboard'
import { getNativeAppInfo } from './device'
import { genericImportantError } from './event'
import * as CustomEvent from './customEvent'

const TIMEOUT_TO_BRIDGE_READY = 10000
const eventTransmitter = transmitter()
let eventsPending: object[] = []
let setupNativeBridge = false

export function isBridgeReady() {
  return !!(
    window.WebViewBridge && typeof window.WebViewBridge.send === 'function'
  )
}

export function sendEventToBridge(event: any) {
  event = safeStringify(event)
  event = btoa(event)
  window.WebViewBridge && window.WebViewBridge.send(event)
}

export function webViewBridgeReady(
  callback: () => any,
  timeout = TIMEOUT_TO_BRIDGE_READY
) {
  if (isBridgeReady()) {
    callback()
    return
  }

  /* iOS dispatch an event to acknowledge that bride is ready */

  function handler() {
    document.removeEventListener('WebViewBridge', handler, false)
    callback()
  }

  document.addEventListener('WebViewBridge', handler, false)

  /* Check problems on bridge ready */

  setTimeout(() => {
    let isBrowser = false

    try {
      const appInfo = getNativeAppInfo()
      isBrowser = appInfo.platform.toLowerCase() === 'browser'
    } catch (e) {
      console.error('Error on device state', e)
    }

    if (!isBridgeReady() && !isBrowser) {
      genericImportantError('bridge-ready-timeout-error', {
        context: 'Bridge',
        'event-name': 'bridge-ready-timeout-error',
        eventsPending: safeStringify(eventsPending),
      })
    }
  }, timeout)
}

export function setupWebViewBridge() {
  if (!isBridgeReady() || setupNativeBridge) {
    return
  }

  setupNativeBridge = true

  window.WebViewBridge.onMessage = function (data) {
    try {
      data = atob(data)
      data = JSON.parse(data)
      if (data && data.type) {
        eventTransmitter.push(data)
      }
    } catch (error) {
      console.error('Error receiving webview bridge message', error, data)
    }
  }

  window.WebViewBridge.onError = function () {
    console.error('An error has ocurred sending a WebViewBridge event!')
  }

  sendEvent({
    type: 'webviewBridgeReady',
  })

  callEventsPending()
}

export function callEventsPending() {
  if (eventsPending && eventsPending.length === 0) {
    return
  }

  eventsPending.forEach((event) => {
    sendEvent(event)
  })

  eventsPending = []
}

export function sendEvent(event: any) {
  if (setupNativeBridge || isBridgeReady()) {
    setupWebViewBridge()
    sendEventToBridge(event)
  } else {
    eventsPending.push(event)
  }

  if (event.type) {
    CustomEvent.sendEvent(event.type, event.data || {})
  }
}

export function initWebViewBridge() {
  webViewBridgeReady(setupWebViewBridge)
}

export function reset() {
  eventsPending = []
  setupNativeBridge = false
}

export function getEventsPending() {
  return eventsPending
}

export function listen(callback: (e: KeyboardBarcode) => any) {
  eventTransmitter.subscribe(callback)
}

export function unlisten(callback: (e: KeyboardBarcode) => any) {
  eventTransmitter.unsubscribe(callback)
}

interface WebViewBridgeType {
  send: (event: any) => any
  onMessage: (data: any) => any
  onError: () => any
}

declare global {
  interface Window {
    WebViewBridge: WebViewBridgeType
  }
}
