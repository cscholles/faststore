import React, { Component } from 'react'
import Button from '@vtex/styleguide/lib/Button'

import { getInstoreConfig } from '../../utils/config'
import * as EmailUtils from '../../utils/email'
import { logClickEvent } from '../../utils/event'
import * as CustomEvent from '../../utils/customEvent'

interface Props {
  onSetCustomerIdentification(email: string): void
}

interface State {
  allowAnonymousUser: boolean
}

export default class CustomerAnonymous extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      allowAnonymousUser: getInstoreConfig().allowAnonymousUser,
    }
  }

  public handleAnonymous = (): void => {
    const email = EmailUtils.getNewAnonymousEmail()

    logClickEvent('identify-anonymously', 'Sale')
    this.props.onSetCustomerIdentification(email)
  }

  public componentDidMount(): void {
    CustomEvent.listenEvent('config.updated', this.handleConfigUpdated)
  }

  public componentWillUnmount(): void {
    CustomEvent.unlistenEvent('config.updated', this.handleConfigUpdated)
  }

  public handleConfigUpdated = (): void => {
    this.setState({
      allowAnonymousUser: getInstoreConfig().allowAnonymousUser,
    })
  }

  public render(): React.ReactNode {
    if (!this.state.allowAnonymousUser) return null

    return (
      <div id="customer-anonymous-container" className="tc pb6">
        <div className="mt5 mb4 f4-ns tc">or</div>
        <Button
          id="useranonymous-button"
          onClick={this.handleAnonymous}
          variation="tertiary"
        >
          Continue as anonymous
        </Button>
      </div>
    )
  }
}
