export function handleCursorPosition(inputValue: string, inputRef: any) {
  // FIXME: can we be more specific for type of inputRef?
  // selectionStart/End only applies to these types of input, throws an error on the others
  // https://html.spec.whatwg.org/multipage/input.html#do-not-apply
  const allowedInputTypes = ['text', 'search', 'url', 'tel', 'password']
  const inputType = String(inputRef.getAttribute('type')).toLowerCase()
  const isAllowed = allowedInputTypes.includes(inputType)
  if (!isAllowed) return false
  setTimeout(() => {
    // DOM still not reflected the changes of render() without a timeout
    const inputLength = inputValue ? inputValue.length : 0
    inputRef.selectionStart = inputLength
    inputRef.selectionEnd = inputLength
  })
}

export function handleInputMask(
  prevInputValue: string,
  currentInputValue: string,
  mask: (v: string) => any,
  inputRef: any
) {
  /* This function is a workaround for android bug with input value changes.
    Cursor position stays at same position when typing CPF with mask */
  prevInputValue = mask(prevInputValue)
  currentInputValue = mask(currentInputValue)
  if (prevInputValue !== currentInputValue) {
    handleCursorPosition(currentInputValue, inputRef)
  }
}
