export interface TransmitterUnsubs {
  [key: string]: Function
}

export default function transmitter() {
  const subscriptions: Function[] = []
  let pushing: boolean = false
  let toUnsubscribe: TransmitterUnsubs = {}

  const unsubscribe = (onChange: Function): void => {
    if (pushing) {
      toUnsubscribe.push(onChange)
      return
    }
    const id = subscriptions.indexOf(onChange)
    if (id >= 0) subscriptions.splice(id, 1)
  }

  const subscribe = (onChange: Function) => {
    subscriptions.push(onChange)
    const dispose = () => unsubscribe(onChange)
    return { dispose }
  }

  const push = (value: any) => {
    pushing = true
    try {
      subscriptions.forEach((subscription) => subscription(value))
    } finally {
      pushing = false
      toUnsubscribe = toUnsubscribe.filter(unsubscribe)
    }
  }

  return { subscribe, push, unsubscribe, subscriptions }
}
