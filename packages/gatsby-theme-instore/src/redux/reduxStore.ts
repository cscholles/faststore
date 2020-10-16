let reduxStore: any = null

export function saveReduxStore(store: InStoreReduxStore) {
  reduxStore = store

  return reduxStore
}

export function getReduxStore(): InStoreReduxStore {
  return reduxStore
}

declare global {
  interface Window {
    getReduxStore: () => InStoreReduxStore
  }
}

window.getReduxStore = getReduxStore
