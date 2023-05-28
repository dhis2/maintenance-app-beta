/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CategoryOptionCombo } from './CategoryOptionCombo'
import type { OrganisationUnit } from './OrganisationUnit'
import type { ValidationRule } from './ValidationRule'

export type ValidationResult = {
    attributeOptionCombo: CategoryOptionCombo
    created: string
    dayInPeriod: number
    id: number
    leftsideValue: number
    notificationSent: boolean
    organisationUnit: OrganisationUnit
    period: string
    rightsideValue: number
    validationRule: ValidationRule
}
