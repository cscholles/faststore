export function startClientProfileEvent(): void {
  // FIXME: use splung events
  // splunkEvents.logEvent('Important', 'Info', 'step-profile', {
  //   context: 'Internal',
  //   marker: 'start',
  // })
  console.log('Important', 'Info', 'step-profile', {
    context: 'Internal',
    marker: 'start',
  })
}

export function logClickEvent(
  eventName: string,
  context: string,
  extraData: object = {}
): void {
  // FIXME: use splung events
  // splunkEvents.logEvent('Default', 'Info', 'click-event', {
  //   'event-name': eventName,
  //   context,
  //   ...extraData,
  // })
  console.log('Default', 'Info', 'click-event', {
    'event-name': eventName,
    context,
    ...extraData,
  })
}

export function genericImportantError(
  eventWorkflowType: string,
  eventData: object
): void {
  // FIXME: use splung events
  // logRocket.logNonIntrusiveError(eventWorkflowType, eventData)
  // splunkEvents.logEvent('Important', 'Error', eventWorkflowType, eventData)
  console.log('Important', 'Error', eventWorkflowType, eventData)
}
