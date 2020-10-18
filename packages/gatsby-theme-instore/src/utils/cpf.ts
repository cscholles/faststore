import { isNaN, isEmpty } from 'lodash'

import { mask } from './mask'

export const CPF_MASK = '999.999.999-99'

const ONE_NUMBER_CPF = /^1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}$/

export function isValidCPF(cpf: string): boolean {
  if (!cpf) {
    return false
  }

  let sum = 0
  let remainder

  cpf = clearMask(cpf)

  if (cpf.length !== 11) {
    return false
  }

  if (ONE_NUMBER_CPF.test(cpf)) {
    return false
  }

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.substring(9, 10), 10)) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.substring(10, 11), 10)) return false

  return true
}

export function maskCPF(data: string, cpfMask = CPF_MASK): string {
  return mask(data, cpfMask)
}

export function clearMask(data: string): string {
  return data.replace(/[^\d]+/g, '')
}
