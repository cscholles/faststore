const DIGIT = '9'
const ALPHA = 'A'
const ALPHANUM = 'S'
const ALL = '*'

function RegExpEscape(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function match(char: string, token: string) {
  switch (token) {
    case DIGIT:
      return /[0-9]/.test(char)

    case ALPHA:
      return /[A-ú]/.test(char)

    case ALPHANUM:
      return /[A-ú0-9]/.test(char)

    case ALL:
      return true

    default:
      return new RegExp(RegExpEscape(token)).test(char)
  }
}

function mask(value: string, _mask: string): string {
  if (!value || !_mask) return ''

  for (let i = 0; i < value.length; i++) {
    // If the character is OK with the mask
    if (match(value[i], _mask[i])) {
      continue
    }

    // If it's there's a space or a non-word character in the mask
    // just insert the character inbetween the value
    if (_mask[i] === ' ' || new RegExp(/\W/).test(_mask[i])) {
      const firstPart = value.slice(0, i)
      const secondPart = value.slice(i)

      value = firstPart + _mask[i] + secondPart
      value = mask(value, _mask)
      break
    }

    // If it doesn't match, remove the character
    const firstPart = value.slice(0, i)
    const secondPart = value.slice(i + 1)

    value = firstPart + secondPart
    value = mask(value, _mask)
  }

  return value
}

export default mask
