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
