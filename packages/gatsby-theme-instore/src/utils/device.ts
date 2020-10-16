import { getReduxStore } from '../redux/reduxStore'
import get from 'lodash/get'
import isBoolean from 'lodash/isBoolean'

type AppInfoType = {
  platform: string
  version: string
}

export function getResourceInfo(resourceName: string): any {
  return get(getReduxStore()?.getState().device, ['resources', resourceName])
}

export function resourceIsAvailable(resourceName: string): boolean {
  const resourceInfo = getResourceInfo(resourceName)

  if (resourceInfo === undefined) {
    return false
  }

  if (isBoolean(resourceInfo)) {
    return resourceInfo
  }

  return resourceInfo.available
}

export function getNativeAppInfo(): AppInfoType {
  let nativeAppInfo

  try {
    nativeAppInfo = getReduxStore()?.getState().device.appInfo
  } catch (_) {
    nativeAppInfo = {}
  }

  return nativeAppInfo
}

export function getNativePlatform(): string {
  const nativeAppInfo = getNativeAppInfo()

  return nativeAppInfo?.platform?.toLowerCase()
}

interface DevicesType {
  getNativePlatform: () => string
}

interface VtexInstoreType {
  devices: DevicesType
}

declare global {
  interface Window {
    vtexInstore: VtexInstoreType
  }
}

window.vtexInstore = window.vtexInstore || {}
window.vtexInstore.devices = window.vtexInstore.devices || {}

window.vtexInstore.devices.getNativePlatform = getNativePlatform
