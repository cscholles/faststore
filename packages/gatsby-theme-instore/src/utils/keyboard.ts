export type KeyboardBarcode = {
  data: { barcode: string }
  type?: string
}
export type KeyboardHandlerType = (obj: KeyboardBarcode) => any

// FIXME: why KeyboardEvent has no attribute "path"? :thinking-face:
interface InstoreKeyboardEvent extends KeyboardEvent {
  path: HTMLElement[]
}

const ABORT_TIMEOUT = 2000
const delimiterKeys = ['Enter', 'Tab', 'Space']
let handlers: KeyboardHandlerType[] = []
let isListeningToKeyboard = false
let abortTimeout: NodeJS.Timeout | null = null
let inputBuffer = ''

function listen(handler: KeyboardHandlerType) {
  handlers = [...handlers, handler]
  if (!isListeningToKeyboard) {
    isListeningToKeyboard = true
    window.addEventListener('keydown', handleKeyboardEvent)
  }
}

function unlisten(handler: KeyboardHandlerType) {
  handlers = handlers.filter((cur) => cur !== handler)
  if (isListeningToKeyboard) {
    isListeningToKeyboard = false
    window.removeEventListener('keydown', handleKeyboardEvent)
  }
}

function handleKeyboardEvent(ev: KeyboardEvent) {
  const inputElementTypes = ['input', 'textarea']

  const event = <InstoreKeyboardEvent>ev // FIXME: really need this? :thinking-face:
  const currentElement = event.path[0]
  const currentElementType = currentElement.nodeName.toLowerCase()

  if (!inputElementTypes.includes(currentElementType)) {
    const { key, code } = event
    if (key.length === 1) {
      inputBuffer += key
    }
    startAbortTimeout()
    if (delimiterKeys.includes(code)) {
      event.preventDefault()
      handlers.forEach((handler) =>
        handler({
          data: {
            barcode: inputBuffer,
          },
        })
      )
      clear()
      stopAbortTimeout()
    }
  }
}

function clear() {
  inputBuffer = ''
}

function startAbortTimeout() {
  if (abortTimeout !== null) {
    stopAbortTimeout()
  }
  abortTimeout = setTimeout(clear, ABORT_TIMEOUT)
}

function stopAbortTimeout() {
  if (abortTimeout !== null) {
    clearTimeout(abortTimeout)
    abortTimeout = null
  }
}

export default { listen, unlisten }
