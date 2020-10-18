const DIGIT = '9'
const ALPHA = 'A'
const ALPHANUM = 'S'
const ALL = '*'

const mask_to_regex: Record<string, string> = {
  '9': '\\d',
  A: '\\p{L}',
  S: '[\\p{L}|\\d]',
  ' ': '\\s',
  '*': '.',
}

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

export function mask(value: string, _mask: string): string {
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

export function createRegex(mask: string): RegExp {
  const resultRegexp = []
  let lastChar = ''
  let countSequence = 0
  let regexPart = ''

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i]

    regexPart = mask_to_regex[char] ?? `[\\${char}]`
    if (char === lastChar) {
      countSequence += 1
    } else {
      countSequence = 0
    }

    if (regexPart !== '' && i + 1 < mask.length && mask[i + 1] !== char) {
      const part =
        countSequence > 0
          ? `${regexPart}{0,${countSequence + 1}}`
          : `${regexPart}{0,1}`

      resultRegexp.push(part)
    }

    lastChar = char
  }

  if (regexPart !== '') {
    const part =
      countSequence > 0
        ? `${regexPart}{0,${countSequence + 1}}`
        : `${regexPart}{0,1}`

    resultRegexp.push(part)
  }

  return new RegExp(resultRegexp.join(''), 'gu')
}
