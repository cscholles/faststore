let reduxStore: any = null

export function saveReduxStore(store: any) {
  reduxStore = store

  return reduxStore
}

export function getReduxStore() {
  return reduxStore
}

declare global {
  interface Window {
    getReduxStore: () => any
  }
}

window.getReduxStore = getReduxStore
