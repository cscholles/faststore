interface CustomEvent extends Event {
  data: any
}

export function sendEvent(eventName: string, data: any): CustomEvent {
  const customEvent = <CustomEvent>window.document.createEvent('Event')
  customEvent.data = data
  customEvent.initEvent(eventName, true, true)
  window.document.dispatchEvent(customEvent)

  if (window.frames) {
    for (let i = 0; i < frames.length; i++) {
      const payload = JSON.parse(JSON.stringify({ type: eventName, data }))
      frames[i].postMessage(payload, '*')
    }
  }

  return customEvent
}

export function listenEvent(
  eventName: string,
  callback: (evt: Event) => void
): void {
  document.addEventListener(eventName, callback, false)
}

export function unlistenEvent(
  eventName: string,
  callback: (evt: Event) => void
): void {
  document.removeEventListener(eventName, callback, false)
}
