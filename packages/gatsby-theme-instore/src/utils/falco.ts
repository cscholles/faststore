import { IotApp, IotDeviceData } from './iot'
import { MqttClientWrapper } from './mqtt'

export default class Falco extends IotApp {
  get config() {
    return { scope: 'vtex', appName: 'falco', appMajorVersion: '1' }
  }
  get name() {
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
  ) {
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
