import { PairableIotApp, IotConfig, IotDeviceDataType } from './iot'

export default class CodeReader extends PairableIotApp {
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
  ) {
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
