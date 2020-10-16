import mqtt from 'mqtt'
import asap from 'asap'
import uuid from 'uuid'
import { EventEmitter } from 'events'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'

import { getAccountName } from './url'
import { MqttClientWrapper, MqttApp } from './mqtt'
import { setInLocalStorage, getFromLocalStorage } from './localStorage'

const MIN_CONNECTION_RETRY_TIME = 300 // 0.3 seconds
const MAX_CONNECTION_RETRY_TIME = 300000 // 5 minutes
let connectionAttempts = 0

function getReconnectionTime(): number {
  const connectionTime = Math.round(
    MIN_CONNECTION_RETRY_TIME * Math.exp(connectionAttempts)
  )
  if (connectionTime <= MAX_CONNECTION_RETRY_TIME) {
    connectionAttempts += 1
    return connectionTime
  }
  return MAX_CONNECTION_RETRY_TIME
}

function registerApps(appManager: IotAppManager): IotAppManager {
  return appManager.registerApp(new Falco())
}

export function getInstallationId(): string {
  let installationId = getFromLocalStorage('installationId')
  if (installationId === null) {
    installationId = uuid.v4()
    setInLocalStorage('installationId', installationId)
  }
  return installationId
}

export type IotConfig = {
  appName: string
  appMajorVersion: string
  scope?: string
}

type IotDeviceInfo = {
  status: string
  pair: string
}

export type IotDeviceDataType = {
  mqttApp: MqttApp
  info: IotDeviceInfo
  status: string
}

export interface IotDeviceData {
  [key: string]: IotDeviceDataType
}

/**
 * Extend if you are implementing code for an app without '/_info/#'.
 */
export class IotApp {
  private _clientWrapper?: MqttClientWrapper
  private _eventHandler?: (ev: string, ...args: any[]) => any
  private _account?: string
  private _storeId?: string

  // This is necessary to determine the appId and baseTopic
  get config(): IotConfig {
    // Returns { scope: string, appName: string, appMajorVersion: string }
    throw new Error('You must override get config() in your app')
  }

  get name(): string {
    // Returns the name to be shown in the Iot Devices page
    throw new Error('You must override get name() in your app')
  }

  // This is necessary to list the devices in the Iot Devices page
  get devices(): IotDeviceData {
    // Returns { [deviceId: string]: any }
    throw new Error('You must override get devices() in your app')
  }

  isConnected(deviceId: string): boolean {
    throw new Error(
      'You must override isConnected() in your app. ' +
        `Can't determine status for ${deviceId}.`
    )
  }

  // Called by IotAppManager when mqtt connects (only first connect per client)
  onMqttConnect(
    clientWrapper: MqttClientWrapper,
    eventHandler: (ev: string, ...args: any[]) => any,
    account: string,
    storeId: string
  ) {
    this._clientWrapper = clientWrapper
    this._eventHandler = eventHandler
    this._account = account
    this._storeId = storeId
  }

  // Called by IotAppManager when mqtt ends connection
  onMqttEnd(): void {
    delete this._clientWrapper
    delete this._eventHandler
    delete this._account
    delete this._storeId
  }

  // Called by IotAppManager when mqtt reconnects after a disconnection
  onMqttReconnect(): void {}

  /* You probably do not want to override these */

  emit(eventName: string, ...args: any[]): void {
    if (this._eventHandler instanceof Function) {
      this._eventHandler(eventName, ...args)
    }
  }

  debug(deviceId: string, ...msgs: string[]): void {
    console.debug &&
      console.debug(`[MQTT] [${this.config.appName}::${deviceId}] >>`, ...msgs)
  }

  get appId() {
    const { appName, appMajorVersion, scope = 'device' } = this.config
    return `${scope}/${appName}/${appMajorVersion}`
  }
  get baseTopic() {
    return `${this.appId}/${this.account}/${this.storeId}`
  }

  get account() {
    return this._account
  }

  get storeId() {
    return this._storeId
  }

  get clientWrapper(): MqttClientWrapper | unknown {
    return this._clientWrapper
  }

  // get client(): mqtt.Client {
  //   return this.clientWrapper.client
  // }
}

class Falco extends IotApp {
  get config(): IotConfig {
    return { scope: 'vtex', appName: 'falco', appMajorVersion: '1' }
  }
  get name(): string {
    return 'Falco'
  }
  get devices(): IotDeviceData {
    return {}
  } // falco has no devices

  onMqttConnect(
    clientWrapper: MqttClientWrapper,
    eventHandler: (ev: string, ...args: any[]) => any,
    account: string,
    storeId: string
  ): void {
    const { scope, appName, appMajorVersion } = this.config
    const BASE_TOPIC = `${scope}/${appName}/${appMajorVersion}/${account}`
    const CHECKIN_TOPIC = `${BASE_TOPIC}/checkin`

    clientWrapper.subscribe(CHECKIN_TOPIC)

    clientWrapper.onMessage(CHECKIN_TOPIC, (topic: string, message: string) => {
      if (topic === CHECKIN_TOPIC) {
        eventHandler('Falco.checkIn', message)
      }
    })
  }
}

/**
 * Extend if you are implementing code for an app with '/_info/#' (for pairable
 * apps use PairableIotApp instead).
 *
 * Additional events you may implement by extending this:
 *   onChangeInfo(deviceId, deviceData, previousDeviceData, infoSubtopic)
 *   // emits ('App.onChangeInfo', appId, deviceId, info, this)
 *   // deviceData contains {mqttApp: MqttApp, info: {}}
 *   // infoSubtopic is the remaining topic after '.../_info/'
 * This emits an event 'App.changeInfo' (listen to it via IotAppManager)
 */
export class FindableIotApp extends IotApp {
  private _devices: IotDeviceData = {}

  get devices(): IotDeviceData {
    return this._devices
  }

  getDeviceData(deviceId: string): IotDeviceDataType {
    return this.devices[deviceId]
  }

  isConnected(deviceId: string): boolean {
    const { info } = this.getDeviceData(deviceId)
    return info?.status === 'connected'
  }

  onChangeInfo(
    deviceId: string,
    { mqttApp: MqttApp }: IotDeviceDataType,
    previousDeviceData: any,
    infoSubtopics?: string
  ): void {}

  onMqttConnect(
    clientWrapper: MqttClientWrapper,
    eventHandler: (ev: string, ...args: any[]) => any,
    account: string,
    storeId: string
  ) {
    super.onMqttConnect(clientWrapper, eventHandler, account, storeId)

    const INFO_TOPIC = `${this.baseTopic}/+/_info/#`
    clientWrapper.onMessage(INFO_TOPIC, (topic: string, message: string) => {
      const topicLevels = topic.split('/')
      const deviceId = topicLevels[5]
      const infoSubtopics = topicLevels.slice(7)

      const previousDeviceData = this._devices[deviceId]
      const deviceData = previousDeviceData || {
        mqttApp: new MqttApp(clientWrapper, `${this.baseTopic}/${deviceId}`),
        info: Object.create(null),
      }
      deviceData.info = cloneDeep(deviceData.info)
      set(deviceData.info, infoSubtopics, message)
      this._devices[deviceId] = deviceData

      this.onChangeInfo(
        deviceId,
        deviceData,
        previousDeviceData,
        infoSubtopics.join('/')
      )
      this.emit('App.changeInfo', this.appId, deviceId, deviceData.info, this)
    })
    clientWrapper.subscribe(INFO_TOPIC, { qos: 1 })
  }

  onMqttEnd(): void {
    super.onMqttEnd()
    for (const deviceId in this._devices) {
      delete this._devices[deviceId]
    }
  }
}

/**
 * Extend if you are implementing code for a pairable app with '/_info/#'.
 */
export class PairableIotApp extends FindableIotApp {
  get pairable() {
    return true
  }

  getPair(deviceId: string): string {
    const { info } = this.devices[deviceId] || {}
    return info && info.pair
  }

  isPaired(deviceId: string) {
    return this.getPair(deviceId) === getInstallationId()
  }

  pair(deviceId: string) {
    const { mqttApp } = this.devices[deviceId] || {}
    if (mqttApp) {
      mqttApp.publish('_info/pair', getInstallationId(), {
        qos: 1,
        retain: true,
      })
    }
  }

  unpair(deviceId: string) {
    const { mqttApp } = this.devices[deviceId] || {}
    if (mqttApp) {
      mqttApp.publish('_info/pair', '', { qos: 1, retain: true })
    }
  }
}

class IotAppManager extends EventEmitter {
  private _apps: Set<IotApp>
  private _storeId?: string
  private _clientWrapper?: MqttClientWrapper

  get MQTT_ENDPOINT(): string {
    return 'wss://mqtt-broker.vtex.com.br:8884'
  }
  get storeId(): any {
    return this._storeId
  }
  get apps(): Set<IotApp> {
    return this._apps
  }

  constructor() {
    super()
    this._apps = new Set()
  }

  listFoundApps() {
    // { [deviceId: string]: IotApp[] }
    const foundApps = Object.create(null)
    this.apps.forEach((app: IotApp) => {
      for (const deviceId in app.devices) {
        foundApps[deviceId] = foundApps[deviceId] || []
        foundApps[deviceId].push(app)
      }
    })
    return foundApps
  }

  registerApp(app: IotApp): IotAppManager {
    this._apps.add(app)
    return this
  }

  start(storeId: string, forceRestart: boolean = false): IotAppManager {
    if (!forceRestart && this.storeId === storeId) {
      return this // storeId didn't change, no need to restart
    }
    this.end()

    this._storeId = storeId
    const client = mqtt.connect(this.MQTT_ENDPOINT)
    this._clientWrapper = new MqttClientWrapper(client)

    client.on('offline', () => {
      asap(() => this.end())

      const retryTime = getReconnectionTime()
      console.debug &&
        console.debug(
          `[MQTT] BROKER IS OFFLINE, RETRYING IN ${retryTime} MILISECONDS`
        )

      setTimeout(() => {
        this.start(storeId, true)
      }, retryTime)
    })

    let alreadyConnectedOnce = false
    client.on('connect', () => {
      console.debug &&
        console.debug(
          `[MQTT] Connected to broker at ${this.MQTT_ENDPOINT}, tracking `,
          `devices in store ${this.storeId}.`
        )

      alreadyConnectedOnce
        ? this._notifyApps('onMqttReconnect')
        : this._notifyApps('onMqttConnect', {
            clientWrapper: this._clientWrapper,
            account: getAccountName(),
            storeId: this.storeId,
            eventHandler: (ev: string | symbol, ...args: any[]) =>
              this.emit(ev, ...args),
          })
      alreadyConnectedOnce = true
    })
    return this
  }

  end(): IotAppManager {
    if (this._clientWrapper) {
      this._clientWrapper.client.end()
      this._notifyApps('onMqttEnd')
      delete this._clientWrapper
      delete this._storeId
    }
    return this
  }

  _notifyApps(event: string, data?: object): IotAppManager {
    // FIXME: convert to typescript
    // this._apps.forEach((app) => {
    //   if (typeof app[event] === 'function') {
    //     asap(() => app[event](data))
    //   }
    // })
    return this
  }
}

class CodeReader extends PairableIotApp {
  get config(): IotConfig {
    return { appName: 'codereader', appMajorVersion: '1' }
  }
  get name(): string {
    return 'Barcode Reader'
  }

  onChangeInfo(
    deviceId: string,
    { mqttApp }: IotDeviceDataType,
    previousDeviceData: any
  ): void {
    if (!previousDeviceData) {
      // Found the app in a new device, so register message listener
      mqttApp.onMessage('data/barcode', (message: string) => {
        this.debug(deviceId, `received barcode ${message}`)
        this.emit('CodeReader.read', message)
      })
    }
    if (this.isConnected(deviceId) && this.isPaired(deviceId)) {
      mqttApp.subscribe('data/barcode')
    } else {
      mqttApp.unsubscribe('data/barcode')
    }
  }
}

export default registerApps(new IotAppManager())
