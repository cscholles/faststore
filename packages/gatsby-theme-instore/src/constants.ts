// master data consts
export const VENDOR_ENTITY_ID = 'vendors'
export const VENDOR_ENTITY_FIELDS = 'store_linked,store,name,user,code'
export const VENDOR_STORE_FIELD = 'store_linked'
export const STORE_ENTITY_ID = 'stores'
export const STORE_ENTITY_FIELDS =
  'name,tradePolicy,pickupPoint,franchiseAccount'
export const CLIENT_ENTITY_ID = 'CL'
export const CLIENT_ENTITY_FIELDS = 'email'
export const DEFAULT_SCHEMA = 'v1'

// functions consts
export const DEFAULT_GLOBAL_FUNCTION_ACCOUNT = 'instore'

// filters consts
export const DEFAULT_OMS_FILTERS = {
  f_UtmSource: '{{ vendor.storeId }}',
}

// OMS consts
export const DEFAULT_OMS_CANCEL_CONFIG = {
  saveFiscalNote: false, // if inStore client should save the xml on master data and OMS (inStore middleware should do it)
  cancelOMSOrder: true, // if inStore client should make a cancel request to OMS
}
