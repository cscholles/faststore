import { Cookies } from 'react-cookie'

export const CHECKOUT_COOKIE_KEY = 'checkout.vtex.com'
export const LOGIN_COOKIE_KEY = 'VtexIdclientAutCookie'
const CHECKOUT_AUTH_COOKIE_KEY = 'Vtex_CHKO_Auth'
const COOKIE_PATH = '/'
const COOKIE_DOMAIN = window.location.hostname
const ORDER_FORM_ID_KEY = '__ofid'
const RCSESSION_COOKIE_KEY = 'VtexRCSessionIdv7'
const ISI_COOKIE_KEY = 'ISI'

class CookieHelper {
  private cookie: Cookies

  constructor() {
    this.cookie = new Cookies()
  }

  public getOrderFormId(): string | null {
    const checkoutCookieValue = <string>this.cookie.get(CHECKOUT_COOKIE_KEY)

    if (!checkoutCookieValue) {
      // FIXME: have we a better way to check if it's empty on typescript?
      return null
    }

    let orderFormId: string | null = null
    const parsedValue = checkoutCookieValue.split('=')

    if (parsedValue[0] === ORDER_FORM_ID_KEY && parsedValue.length === 2) {
      orderFormId = parsedValue[1]
    }

    return orderFormId
  }

  public setOrderFormId(orderFormId: string): void {
    const value = `${ORDER_FORM_ID_KEY}=${orderFormId}`

    this.cookie.set(CHECKOUT_COOKIE_KEY, value, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
      encode: (val) => val,
    })
  }

  public setISI(user: string): void {
    const value = `ium=${user}`

    this.cookie.set(ISI_COOKIE_KEY, value, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
      encode: (val) => val,
    })
  }

  public removeISI(): void {
    this.cookie.remove(ISI_COOKIE_KEY, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
    })
  }

  public getVtexIdToken(): string | any {
    // FIXME: can be better than "any" on return?
    return this.cookie.get(LOGIN_COOKIE_KEY)
  }

  public getRcSession(): string | any {
    // FIXME: can be better than "any" on return?
    return this.cookie.get(RCSESSION_COOKIE_KEY)
  }

  public removeCheckoutCookie(): void {
    this.cookie.remove(CHECKOUT_COOKIE_KEY, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
    })
  }

  public removeCheckoutAuthCookie(): void {
    this.cookie.remove(CHECKOUT_AUTH_COOKIE_KEY, {
      path: COOKIE_PATH,
      domain: COOKIE_DOMAIN,
    })
  }

  public removeLoginCookie(): void {
    this.cookie.remove(LOGIN_COOKIE_KEY, {
      path: COOKIE_PATH,
    })
  }

  public parseJwt(token: string): any {
    const [, base64Url] = token.split('.')
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    return JSON.parse(window.atob(base64))
  }

  public setCookie(
    key: string,
    value: any,
    expires: number | string | Date, // FIXME: can we refact to use only one type?
    path = COOKIE_PATH,
    domain?: string,
    secure?: boolean
  ): void {
    if (!key || !value) {
      return
    }

    if (!key || /^(?:expires|max-age|path|domain|secure)$/.test(key)) {
      return
    }

    let sExpires = ''

    if (expires) {
      if (expires instanceof Number) {
        sExpires = `; max-age=${expires}`
      } else if (expires instanceof String) {
        sExpires = `; expires=${expires}`
      } else if (expires instanceof Date) {
        sExpires = `; expires=${expires.toUTCString()}`
      }
    }

    document.cookie = `${key}=${value}${sExpires}${
      domain ? `; domain=${domain}` : ''
    }${path ? `; path=${path}` : ''}${secure ? '; secure' : ''}`
  }

  public setEnvCookie(environment: string): void {
    const tomorrow = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)
    this.setCookie('vtex-commerce-env', environment, tomorrow.toString())
  }
}

export default new CookieHelper()
