import reduce from 'lodash/reduce'
import isFunction from 'lodash/isFunction'

export type StepOrderType = {
  id: string
  estimatedDuration: number
  message: string
  stepGroup?: string
  totalEstimatedDuration?: (n: number) => number
  context?: any
}

export interface StepOrderObjType {
  [key: string]: StepOrderType
}

interface StepOrderContextType {
  [key: string]: any
}

interface StepsIndexType {
  [key: number]: number
}

interface StepsCountType {
  [key: number]: StepsIndexType
}

interface StepsDurationsType {
  [key: string]: StepsCountType
}

export function calculateElapsedEstimatedDuration(
  steps: StepOrderType[],
  stepContext: StepOrderObjType,
  defaultContext: any
): number {
  return reduce(
    steps,
    (sum, step) => {
      const stepContextEntry = stepContext[step.id]

      if (stepContextEntry) {
        const estimatedDuration = stepContext[step.id].estimatedDuration
        if (!isNaN(estimatedDuration)) {
          return sum + estimatedDuration
        }
        const context = stepContext[step.id].context || defaultContext
        return sum + calculateStepEstimatedDuration(step, context)
      }

      return sum + calculateStepEstimatedDuration(step)
    },
    0
  )
}

export function calculateEstimatedDuration(
  steps: StepOrderType[],
  context: any
): number {
  return reduce(
    steps,
    (sum, step) => {
      return sum + calculateStepEstimatedDuration(step, context)
    },
    0
  )
}

export function calculateStepEstimatedDuration(
  step: StepOrderType,
  context?: any
): number {
  return isFunction(step.totalEstimatedDuration) && context != null
    ? step.totalEstimatedDuration(context)
    : step.estimatedDuration
}

export function getStepIndex(
  step: StepOrderType,
  stepsList: StepOrderType[]
): number {
  for (let index = 0; index < stepsList.length; index++) {
    const currentStep = stepsList[index]
    if (currentStep.id === step.id) {
      return index
    }
  }
  return -1
}

export class StepCalculator {
  private previousStepsDuration: StepsDurationsType
  private stepsList: StepOrderType[]
  private stepsById: StepOrderObjType

  constructor(stepsList: []) {
    this.previousStepsDuration = {}
    this.stepsList = stepsList
    this.stepsById = {}
    stepsList.forEach((step: StepOrderType) => {
      this.stepsById[step.id] = step
    })
  }

  getEstimatedDuration(externalPaymentsCount: number): number {
    return calculateEstimatedDuration(this.stepsList, externalPaymentsCount)
  }

  getStepContext(
    currentStep: StepOrderType,
    externalPaymentIndex: number,
    externalPaymentsCount: number
  ): StepOrderContextType {
    const stepContext: StepOrderContextType = {}
    const passedPaymentIndex = externalPaymentIndex + 1
    const stepIndex = getStepIndex(currentStep, this.stepsList)
    this.stepsList.forEach((step, index) => {
      let estimatedDuration = 0

      if (index >= stepIndex) {
        if (
          step.stepGroup === currentStep.stepGroup &&
          step.totalEstimatedDuration &&
          externalPaymentsCount > 0
        ) {
          estimatedDuration = calculateStepEstimatedDuration(
            step,
            externalPaymentIndex
          )
        }
      } else {
        if (!step.totalEstimatedDuration || externalPaymentsCount > 0) {
          estimatedDuration = calculateStepEstimatedDuration(
            step,
            passedPaymentIndex
          )
        }
      }

      stepContext[step.id] = {
        estimatedDuration,
      }
    })
    return stepContext
  }

  createPreviousStepsDurationEntry(
    stepId: string,
    index: number,
    count: number,
    elapsedDuration: number
  ): void {
    this.previousStepsDuration[stepId] =
      this.previousStepsDuration[stepId] || {}
    this.previousStepsDuration[stepId][count] =
      this.previousStepsDuration[stepId][count] || {}
    this.previousStepsDuration[stepId][count][index] = elapsedDuration
  }

  getPreviousStepsDuration(
    step: StepOrderType,
    externalPaymentIndex: number,
    externalPaymentsCount: number
  ): number {
    const memoizedDuration = this.previousStepsDuration[step.id]
    if (
      memoizedDuration &&
      memoizedDuration[externalPaymentsCount] &&
      memoizedDuration[externalPaymentsCount][externalPaymentIndex]
    ) {
      return memoizedDuration[externalPaymentsCount][externalPaymentIndex]
    }

    const stepContext = this.getStepContext(
      step,
      externalPaymentIndex,
      externalPaymentsCount
    )

    const elapsedDuration = calculateElapsedEstimatedDuration(
      this.stepsList,
      stepContext,
      externalPaymentsCount
    )

    this.createPreviousStepsDurationEntry(
      step.id,
      externalPaymentIndex,
      externalPaymentsCount,
      elapsedDuration
    )

    return elapsedDuration
  }
}
