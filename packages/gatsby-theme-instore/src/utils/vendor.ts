import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { getReduxStore } from '../redux/reduxStore'
import { createSelectorPathBuilder } from './selector'

export const vendorSelector = createSelectorPathBuilder([
  (state: any) => get(state, ['vendor', 'vendor'], null),
])

export const storeSelector = createSelectorPathBuilder([
  (state: any) => get(state, ['vendor', 'store'], null),
])

export function getVendor(): Vendor | null {
  const store = getReduxStore()
  const data = vendorSelector(store.getState())
  if (data === null) {
    return null
  }
  return <Vendor>data
}

export function getVendorStore(): Store | null {
  const store = getReduxStore()
  const data = storeSelector(store.getState())
  if (data === null) {
    return null
  }
  return <Store>data
}

export function getVendorFranchiseAccount(vendor: Vendor | undefined): string {
  const resultVendor = vendor || getVendor()
  return get(resultVendor, 'franchiseAccount', '') as string
}

export function getVendorId(vendor: Vendor | undefined): string {
  const resultVendor = vendor || getVendor()
  return get(resultVendor, 'id', '') as string
}

export function getVendorEmail(vendor: Vendor | undefined): string {
  const resultVendor = vendor || getVendor()
  return get(resultVendor, 'username', '') as string
}

export function getVtexIdSamlUrl(
  samlId: string,
  authenticationToken?: string
): string {
  return isEmpty(samlId)
    ? ''
    : `/api/vtexid/pub/saml/${samlId}/redirect${
        authenticationToken ? `?authenticationToken=${authenticationToken}` : ''
      }`
}

export function getVtexIdOAuthUrl(providerName: string): string {
  return isEmpty(providerName)
    ? ''
    : `/api/vtexid/pub/authentication/oauth/redirect?providerName=${providerName}`
}

declare global {
  interface Window {
    getVendor: () => Vendor | unknown
  }
}

window.getVendor = getVendor
