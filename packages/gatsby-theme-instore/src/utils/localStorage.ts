import isString from 'lodash/isString'
import safeStringify from 'fast-safe-stringify'

import { genericImportantError } from './event'

export function setInLocalStorage(key: string, value: any): void {
  try {
    window.localStorage.setItem(
      key,
      isString(value) || !value ? value : safeStringify(value)
    )
  } catch (error) {
    const errorString = error.message || safeStringify(error)
    genericImportantError('localstorage-error', {
      error: errorString,
      message: 'Error setting key on local storage',
      context: 'Internal',
      key,
    })
  }
}

export function getFromLocalStorage(key: string, isJson = false): any {
  try {
    const item: string | null = window.localStorage.getItem(key)
    return isJson && item ? JSON.parse(item) : item
  } catch (error) {
    const errorString = error.message || safeStringify(error)
    genericImportantError('localstorage-error', {
      error: errorString,
      message: 'Error getting key from local storage',
      context: 'Internal',
      key,
    })
  }
  return null
}

export function removeFromLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    const errorString = error.message || safeStringify(error)
    genericImportantError('localstorage-error', {
      error: errorString,
      message: 'Error removing key from local storage',
      context: 'Internal',
      key,
    })
  }
}
