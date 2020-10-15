import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import { getInstoreConfig } from './config'

type IdentificationTypesType = {
  enabledByDefault: boolean
  id: string
  label: string
}

export function getAvailableIdentificationTypes(
  idTypes: IdentificationTypesType[]
): IdentificationTypesType[] {
  if (isEmpty(idTypes)) {
    return []
  }

  const {
    enableIdentificationTypes,
    identificationTypesOrder,
  } = getInstoreConfig()

  const availableIdentificationTypes = idTypes.filter((type) => {
    const enabledInSettings =
      enableIdentificationTypes && enableIdentificationTypes[type.id]

    if (!isNil(enabledInSettings)) {
      return enabledInSettings
    }

    return type.enabledByDefault
  })

  if (
    !isEmpty(identificationTypesOrder) &&
    !isEmpty(availableIdentificationTypes)
  ) {
    const maxIndex = availableIdentificationTypes.length

    availableIdentificationTypes.sort((type1, type2) => {
      const idType1 = type1?.id
      const idType2 = type2?.id

      let idTypeIndex1 = identificationTypesOrder.findIndex(
        (idTypeOrder: string) => idTypeOrder === idType1
      )

      let idTypeIndex2 = identificationTypesOrder.findIndex(
        (idTypeOrder: string) => idTypeOrder === idType2
      )

      /* If is not on identificationTypesOrder, make it last (draws in this case will maintain original order) */
      if (idTypeIndex1 === -1) {
        idTypeIndex1 = maxIndex
      }

      if (idTypeIndex2 === -1) {
        idTypeIndex2 = maxIndex
      }

      return idTypeIndex1 - idTypeIndex2
    })
  }

  return availableIdentificationTypes
}
