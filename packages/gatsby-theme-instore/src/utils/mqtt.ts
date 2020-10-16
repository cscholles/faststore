import isNil from 'lodash/isNil'
import safeStringify from 'fast-safe-stringify'
import mqtt from 'mqtt'
import asap from 'asap'

interface MqttListeners {
  [key: string]: Function[]
}

interface MqttSubscriptions {
  [key: string]: boolean
}

/**
 * This provides an easier interface for managing an app that shares the same
 * client with other apps. You should have one MqttApp instance per app per
 * device. Notice this is just another "wrapper" for the mqtt client (above the
 * MqttClientWrapper layer), with higher isolation than the MqttClientWrapper.
 */
export class MqttApp {
  private _clientWrapper: MqttClientWrapper
  private _baseTopic: string
  private _listeners: MqttListeners
  private _subscriptions: MqttSubscriptions

  constructor(clientWrapper: MqttClientWrapper, baseTopic: string) {
    this._clientWrapper = clientWrapper
    this._baseTopic = baseTopic
    this._listeners = Object.create(null)
    this._subscriptions = Object.create(null)
  }

  get baseTopic() {
    return this._baseTopic
  }
  get clientWrapper() {
    return this._clientWrapper
  }

  buildTopic(subtopic: string): string {
    return isNil(this._baseTopic)
      ? subtopic || ''
      : this._baseTopic + (isNil(subtopic) ? '' : `/${subtopic}`)
  }

  subscribe(subtopic: string, options?: MqttOptions) {
    if (!this._subscriptions[subtopic]) {
      this.clientWrapper.subscribe(this.buildTopic(subtopic), options)
      this._subscriptions[subtopic] = true
    }
    return this
  }

  unsubscribe(subtopic: string) {
    if (this._subscriptions[subtopic]) {
      this.clientWrapper.unsubscribe(this.buildTopic(subtopic))
      delete this._subscriptions[subtopic]
    }
    return this
  }

  publish(subtopic: string, message: string, options: MqttOptions) {
    const topic = this.buildTopic(subtopic)
    this.clientWrapper.publish(topic, message, options)
    return this
  }

  // TODO: sounds like no one uses this method, should we erase it? need checks!
  publishAsJson(subtopic: string, messageObject: object, options: MqttOptions) {
    const message = safeStringify(messageObject)
    return this.publish(subtopic, message, options)
  }

  onMessage(subtopic: string, callback: Function) {
    // If it isn't subscribed to the topic, we won't call the callback. This may
    // happen because we use the same client, so other app may have subscribed
    const isSubscribedTo = (topic: string) => {
      const matches = MqttClientWrapper.topicMatches
      for (const subscription in this._subscriptions) {
        if (matches(topic, this.buildTopic(subscription))) {
          return true
        }
      }
      return false
    }
    const listener = (data: any) => isSubscribedTo(data.topic) && callback(data)
    this._listeners[subtopic] = this._listeners[subtopic] || []
    this._listeners[subtopic].push(
      this.clientWrapper.onMessage(this.buildTopic(subtopic), listener)
    )
    return this
  }

  removeListeners(subtopic: string) {
    const listeners = this._listeners[subtopic] || []
    listeners.forEach((listener: Function) =>
      this.clientWrapper.removeMessageListener(listener)
    )
  }
}

type PacketType = {
  cmd: string
  messageId: number
  unsubscriptions: string[]
}

type MqttOptions = {
  qos: number
  retain?: boolean
}

interface MqttSubscription extends MqttOptions {
  count: number
}

interface MqttTopicObject {
  [key: string]: MqttSubscription
}

interface MqttMessageTopics {
  [key: number]: string[]
}

/**
 * This is a wrapper for the client, and is capable of:
 * 1. managing subscriptions from multiple sources that don't know each other,
 *    so they don't affect each other by (un)subscribing the same topic. This is
 *    done in a very low level, only by counting subs and unsubs to the topic.
 * 2. allow listening to topics, instead of having to listen to all messages and
 *    individually check if the received topic matches the expected topic
 * This doesn't provide all methods from the client; access .client for that...
 * You should have a single instance for each client.
 */
export class MqttClientWrapper {
  private _client: mqtt.Client
  private _subscriptions: MqttTopicObject
  private _messageListeners: Function[]
  private _unsubbingTopics: Set<unknown>
  private _messageIdToTopics: MqttMessageTopics

  constructor(client: mqtt.Client) {
    this._client = client

    // { [topic: string]: { callbacks: Set<Function>, count: int, qos: int } }
    this._subscriptions = Object.create(null)

    // Function[]
    this._messageListeners = []

    // Required because the shitty client has a bug that if we try to subscribe
    // during an unsubscribe, it does not subscribe and never allows us to even
    // try again (unless we unsubscribe again or reconnect)
    this._unsubbingTopics = new Set()

    // {[id: number]: topic} -> stores the sent message ids
    this._messageIdToTopics = Object.create(null)

    // FIXME: which type has "on" method?
    this.client.on('packetsend', (packet: PacketType) => {
      const { cmd, messageId, unsubscriptions } = packet
      if (cmd === 'unsubscribe' && !isNil(messageId)) {
        this._messageIdToTopics[messageId] = unsubscriptions
        unsubscriptions.forEach((topic) => this._unsubbingTopics.add(topic))
      }
    })

    this.client.on('packetreceive', (packet: PacketType) => {
      const { cmd, messageId } = packet
      const topics = this._messageIdToTopics[messageId] || []
      delete this._messageIdToTopics[messageId]

      // Handle 'unsuback' (unsubscription acknowledged)
      if (cmd === 'unsuback' && topics.length > 0) {
        topics.forEach((topic) => {
          this._unsubbingTopics.delete(topic)
          const subscriptions = this._subscriptions[topic]
          if (subscriptions && subscriptions.count > 0) {
            // this.client.subscribe({topic, { qos: subscriptions})
          }
        })
      }
    })

    this.client.on(
      'message',
      (topic: string, message: string, packet: PacketType) => {
        this._messageListeners.forEach((listener) =>
          asap(() => listener(topic, message, packet))
        )
      }
    )
  }

  get client(): mqtt.Client {
    return this._client
  }

  subscribe(topic: string, options?: MqttOptions) {
    this._subscriptions[topic] = this._subscriptions[topic] || {
      qos: 0,
      count: 0,
    }
    const subscriptions = this._subscriptions[topic]

    // Maybe use the highest used QoS for this topic, instead of the last?
    subscriptions.qos = Math.max(
      (options && options.qos) || 0,
      subscriptions.qos
    )
    subscriptions.count++

    // If unsubbing, we'll subscribe again on 'unsuback' (on 'packetreceive')
    if (!this._unsubbingTopics.has(topic)) {
      this.client.subscribe(topic, <mqtt.IClientSubscribeOptions>subscriptions)
    }
    return this
  }

  unsubscribe(topic: string, force: boolean = false) {
    const subscriptions = this._subscriptions[topic]
    if (!subscriptions || --subscriptions.count <= 0 || force) {
      delete this._subscriptions[topic]
      this._unsubbingTopics.add(topic)
      this.client.unsubscribe(topic)
    }
    return this
  }

  publish(topic: string, message: string, options: MqttOptions) {
    this.client.publish(topic, message, <mqtt.IClientPublishOptions>options)
    return this
  }

  // callback({topic, message, packet, jsonMessage})
  onMessage(topicPattern: string, callback: Function): Function {
    const onMessage = (topic: string, message: string, packet: PacketType) => {
      message = message.toString()
      if (!MqttClientWrapper.topicMatches(topic, topicPattern)) {
        return // do not match the topicPattern
      }
      let jsonMessage
      try {
        jsonMessage = JSON.parse(message)
      } catch (e) {
        console.error('Error on parsing JSON on mqtt onMessage', e)
      }
      callback({ topic, message, packet, jsonMessage })
    }
    this._messageListeners.push(onMessage)
    return onMessage
  }

  removeMessageListener(listener: Function): boolean {
    const index = this._messageListeners.indexOf(listener)
    return !!(index >= 0 && this._messageListeners.splice(index, 1))
  }

  static topicMatches(topic: string, topicPattern: string): boolean {
    const patternParts = topicPattern.split('/')
    const topicParts = topic.split('/')
    for (let i = 0; i < patternParts.length; i++) {
      const pPart = patternParts[i]
      const tPart = topicParts[i]

      if (pPart === '#' && !isNil(tPart)) {
        break
      } else if (isNil(tPart) || (pPart !== '+' && pPart !== tPart)) {
        return false
      }
    }
    return true
  }
}
