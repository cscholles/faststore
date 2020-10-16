// TODO: turn this into a react component perhaps,
// or redux logic or something
// TODO: generalize this instead of having specific cases

let onReadEmail: Function | null = null
let onReadOrderFormId: Function | null = null
let onReadBarcode: Function | null = null

export function setOnReadEmail(handler: Function): void {
  onReadEmail = handler
}

export function setOnReadOrderFormId(handler: Function): void {
  onReadOrderFormId = handler
}

export function setOnReadBarcode(handler: Function): void {
  onReadBarcode = handler
}

export function handleReadQRCode(value: string): void {
  const isEmail = value.includes('@')
  const isOrderFormId = !isEmail && value.length === 32
  const isBarcode = !isEmail && !isOrderFormId
  if (isEmail && onReadEmail) {
    onReadEmail(value)
  } else if (isOrderFormId && onReadOrderFormId) {
    onReadOrderFormId(value)
  } else if (isBarcode && onReadBarcode) {
    onReadBarcode(value)
  }
}

export default {
  setOnReadEmail,
  setOnReadOrderFormId,
  setOnReadBarcode,
  handleReadQRCode,
}
