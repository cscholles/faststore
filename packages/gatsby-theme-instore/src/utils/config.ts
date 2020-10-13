import isNil from 'lodash/isNil'
import mergeWith from 'lodash/mergeWith'
import isBoolean from 'lodash/isBoolean'

import * as consts from '../constants'
import { getVendor } from './vendor'
import { getAccountName } from './url'

declare global {
  interface Window {
    INSTORE_CONFIG: InStoreConfig
    inStoreAdminSettings: Record<string, any> // TODO: we really can't define this type?
    INSTORE_ADMIN_CUSTOM_SETTINGS: Record<string, any> // TODO: we really can't define this type?
    getInstoreConfig(vendor: Vendor | null): InStoreConfig
  }
}

export const DEFAULT_PAYMENTS_IDS = [
  '16', // Vale presente
  '44', // Cartão de débito
  '45', // Cartão de crédito
  '64', // Credit Control
  '201', // Dinheiro
]

export const notImplementedYet = () => {
  throw new Error('ECommerce Payment not implemented')
}

export const INSTORE_CONFIG_DEFAULT = {
  payments: {
    filters: DEFAULT_PAYMENTS_IDS,
    externals: [],
    isECommerce: () => false,
    toECommerce: notImplementedYet,
    getECommerceExecute: notImplementedYet,
  },
}

function getAccountConfig(vendor: Vendor | null) {
  vendor = vendor || getVendor()
  const store = vendor?.store || { franchiseAccount: '' }
  const seller = store?.franchiseAccount

  if (!seller) {
    return {}
  }

  const instoreConfig: InStoreConfig = {
    ...INSTORE_CONFIG_DEFAULT,
    ...window.INSTORE_CONFIG,
  }
  const accountsConfig = instoreConfig.accounts || {}

  return accountsConfig[seller] || {}
}

function getVendorConfig(vendor: Vendor | null) {
  vendor = vendor || getVendor()
  const vendorEmail = vendor && vendor.username

  if (!vendorEmail) {
    return {}
  }

  const instoreConfig: InStoreConfig = {
    ...INSTORE_CONFIG_DEFAULT,
    ...window.INSTORE_CONFIG,
  }

  const vendorsConfig = instoreConfig.vendors || {}
  return vendorsConfig[vendorEmail] || {}
}

function getEnableIdentificationTypes(
  adminCustomSettings: Record<string, any>
) {
  if (
    isNil(adminCustomSettings.identification.documentIDClientIdentification) ||
    isNil(adminCustomSettings.identification.emailClientIdentification)
  ) {
    return undefined
  }
  return {
    CPF: adminCustomSettings.identification.documentIDClientIdentification,
    Email: adminCustomSettings.identification.emailClientIdentification,
  }
}

export function getAdminCustomSettings() {
  const settings = window.INSTORE_ADMIN_CUSTOM_SETTINGS || {
    functionalities: {},
    identification: {},
  }
  const customerProfileConfig = getCustomerProfile(settings)
  const identificationTypesConfig = getEnableIdentificationTypes(settings)
  return {
    ...(customerProfileConfig
      ? { customerProfile: customerProfileConfig }
      : {}),
    ...(identificationTypesConfig
      ? { enableIdentificationTypes: identificationTypesConfig }
      : {}),
    ...(isBoolean(settings.functionalities.allowCartTransfer)
      ? { transferEnabled: settings.functionalities.allowCartTransfer }
      : {}),
    ...(isBoolean(settings.functionalities.allowProductSuggestions)
      ? {
          recommendationsEnabled:
            settings.functionalities.allowProductSuggestions,
        }
      : {}),
    ...(isBoolean(settings.identification.allowAnonymousUser)
      ? { allowAnonymousUser: settings.identification.allowAnonymousUser }
      : {}),
  }
}

function getCustomerProfile(adminCustomSettings: Record<string, any>) {
  if (
    isNil(adminCustomSettings.identification.allowCompanyRegistration) ||
    isNil(adminCustomSettings.identification.companyRegistrationOptional)
  ) {
    return undefined
  }
  return adminCustomSettings.identification.allowCompanyRegistration
    ? adminCustomSettings.identification.companyRegistrationOptional
      ? { isCorporate: { optional: true } }
      : { isCorporate: true }
    : { isCorporate: false }
}

export function getInstoreConfig(vendor: Vendor | null = null): InStoreConfig {
  const instoreConfig = mergeWith(
    {},
    INSTORE_CONFIG_DEFAULT,
    window.INSTORE_CONFIG,
    getAccountConfig(vendor),
    getVendorConfig(vendor),
    getAdminCustomSettings(),
    (param1: any, param2: any) => (Array.isArray(param1) ? param2 : undefined)
  )

  const accountName = getAccountName()

  const orderPlacedHook = instoreConfig.orderPlacedHook || {}

  const enableIdentificationTypes =
    instoreConfig.enableIdentificationTypes || {}

  const cancelOrderConfig = {
    ...consts.DEFAULT_OMS_CANCEL_CONFIG,
    ...instoreConfig.cancelOrderConfig,
  }

  const showStock = instoreConfig.showStock
  const showAddressReference = instoreConfig.showAddressReference

  const featureToogle = instoreConfig.featureToogle || {}

  const defaultSellerId = instoreConfig.defaultSellerId || '1'

  const accounts = instoreConfig.accounts || {}

  const transferEnabled = instoreConfig.transferEnabled || false

  const sellWithoutStockInHands = !!instoreConfig.sellWithoutStockInHands

  const recommendationsEnabled = !isNil(instoreConfig.recommendationsEnabled)
    ? instoreConfig.recommendationsEnabled
    : true

  const allowAnonymousUser = isNil(instoreConfig.allowAnonymousUser)
    ? true
    : instoreConfig.allowAnonymousUser

  const enableStorePerformance = !isNil(instoreConfig.enableStorePerformance)
    ? instoreConfig.enableStorePerformance
    : false

  const deviceNames = instoreConfig.deviceNames || {}

  const mdCustomConf = instoreConfig.MasterDataConfig || {}

  const printingConfig = instoreConfig.printingConfig || {}

  const deviceConfig = instoreConfig.deviceConfig || {}

  const search = instoreConfig.search || {}

  const productPageSkip = isNil(instoreConfig.productPageSkip)
    ? true
    : instoreConfig.productPageSkip

  const MasterDataConfig = {
    ...mdCustomConf,
    VendorEntity: mdCustomConf.VendorEntity || consts.VENDOR_ENTITY_ID,
    VendorEntityFields:
      mdCustomConf.VendorEntityFields || consts.VENDOR_ENTITY_FIELDS,
    VendorStoreField:
      mdCustomConf.VendorStoreField || consts.VENDOR_STORE_FIELD,
    StoreEntity: mdCustomConf.StoreEntity || consts.STORE_ENTITY_ID,
    StoreEntityFields:
      mdCustomConf.StoreEntityFields || consts.STORE_ENTITY_FIELDS,
    ClientEntity: mdCustomConf.ClientEntity || consts.CLIENT_ENTITY_ID,
    ClientEntityFields:
      mdCustomConf.ClientEntityFields || consts.CLIENT_ENTITY_FIELDS,
    DefaultSchema: mdCustomConf.DefaultSchema || consts.DEFAULT_SCHEMA,
  }

  const customerProfile = instoreConfig.customerProfile || {}
  customerProfile.functionAccountName =
    customerProfile.functionAccountName ||
    consts.DEFAULT_GLOBAL_FUNCTION_ACCOUNT
  customerProfile.accountName = customerProfile.accountName || accountName
  customerProfile.masks = customerProfile.masks || {}
  customerProfile.forceRegisterOnSaleFlow =
    customerProfile.forceRegisterOnSaleFlow ?? false
  customerProfile.showInvoiceAddressOnRegister =
    customerProfile.showInvoiceAddressOnRegister ?? false

  const splunkConfig = instoreConfig.splunkConfig || {
    endpoint: 'https://splunk-heavyforwarder-public.vtex.com:8088',
    token: '12e9e11c-6342-43a6-8613-4417c2a044b7',
  }

  const OMSFilters = instoreConfig.OMSFilters || consts.DEFAULT_OMS_FILTERS

  const portalConfig = instoreConfig.portalConfig || {}
  const trackingConfig = instoreConfig.trackingConfig || {}
  portalConfig.siteName = portalConfig.siteName || 'default'

  const payments = instoreConfig.payments || {}

  const inStoreAdminSettings = instoreConfig.inStoreAdminSettingsEnabled
    ? window.inStoreAdminSettings || {}
    : {}

  const config = {
    ...instoreConfig,
    orderPlacedHook,
    cancelOrderConfig,
    showStock,
    showAddressReference,
    defaultSellerId,
    enableStorePerformance,
    featureToogle,
    customerProfile,
    accountName,
    splunkConfig,
    MasterDataConfig,
    OMSFilters,
    payments,
    accounts,
    deviceNames,
    printingConfig,
    deviceConfig,
    enableIdentificationTypes,
    transferEnabled,
    sellWithoutStockInHands,
    recommendationsEnabled,
    allowAnonymousUser,
    portalConfig,
    trackingConfig,
    search,
    productPageSkip,
    ...inStoreAdminSettings,
  }

  return config
}
