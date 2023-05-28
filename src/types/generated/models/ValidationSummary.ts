/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataElementOperand } from './DataElementOperand'
import type { ValidationResult } from './ValidationResult'

export type ValidationSummary = {
    commentRequiredViolations: Array<DataElementOperand>
    validationRuleViolations: Array<ValidationResult>
}
