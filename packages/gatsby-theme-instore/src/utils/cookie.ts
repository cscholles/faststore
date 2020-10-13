import cookie from 'react-cookie'

export const CHECKOUT_COOKIE_KEY = 'checkout.vtex.com'
const CHECKOUT_AUTH_COOKIE_KEY = 'Vtex_CHKO_Auth'
const COOKIE_PATH = '/'
const COOKIE_DOMAIN = window.location.hostname
const ORDER_FORM_ID_KEY = '__ofid'
const RCSESSION_COOKIE_KEY = 'VtexRCSessionIdv7'
const ISI_COOKIE_KEY = 'ISI'
export const LOGIN_COOKIE_KEY = 'VtexIdclientAutCookie'

class CookieHelper {
  getOrderFormId(): string {
    const checkoutCookieValue = cookie.load(CHECKOUT_COOKIE_KEY)
    let orderFormId = null

    if (checkoutCookieValue) {
      const parsedValue = checkoutCookieValue.split('=')

      if (parsedValue[0] === ORDER_FORM_ID_KEY && parsedValue.length === 2) {
        orderFormId = parsedValue[1]
      }
    }

    return orderFormId
  }

  setOrderFormId(orderFormId) {
    const value = `${ORDER_FORM_ID_KEY}=${orderFormId}`

    cookie.save(CHECKOUT_COOKIE_KEY, value, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
      encode: (val) => val,
    })
  }

  setISI(user) {
    const value = `ium=${user}`
    cookie.save(ISI_COOKIE_KEY, value, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
      encode: (val) => val,
    })
  }

  removeISI() {
    cookie.remove(ISI_COOKIE_KEY, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
    })
  }

  getVtexIdToken() {
    return cookie.load(LOGIN_COOKIE_KEY)
  }

  getRcSession() {
    return cookie.load(RCSESSION_COOKIE_KEY)
  }

  removeCheckoutCookie() {
    cookie.remove(CHECKOUT_COOKIE_KEY, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
    })
  }

  removeCheckoutAuthCookie() {
    cookie.remove(CHECKOUT_AUTH_COOKIE_KEY, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
    })
  }

  removeLoginCookie() {
    cookie.remove(LOGIN_COOKIE_KEY, {
      path: COOKIE_PATH,
    })
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(base64))
  }

  setCookie(
    key,
    value,
    expires,
    path = COOKIE_PATH,
    domain = undefined,
    secure = undefined
  ) {
    if (!key || !value) return false
    if (!key || /^(?:expires|max-age|path|domain|secure)$/.test(key)) {
      return
    }

    let sExpires = ''
    if (expires) {
      switch (typeof expires) {
        case 'number':
          sExpires = `; max-age=${expires}`
          break
        case 'string':
          sExpires = `; expires=${expires}`
          break
        case 'object':
          if (expires.hasOwnProperty('toGMTString')) {
            sExpires = `; expires=${expires.toGMTString()}`
          }
          break
      }
    }

    document.cookie = `${key}=${value}${sExpires}${
      domain ? `; domain=${domain}` : ''
    }${path ? `; path=${path}` : ''}${secure ? '; secure' : ''}`
  }

  setEnvCookie(environment) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.setCookie('vtex-commerce-env', environment, tomorrow.toString())
  }
}

export default new CookieHelper()
