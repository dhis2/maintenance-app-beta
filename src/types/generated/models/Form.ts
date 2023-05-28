/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Group } from './Group'
import type { WebapiWebdomainForm_CategoryCombo } from './WebapiWebdomainForm_CategoryCombo'

export type Form = {
    categoryCombo: WebapiWebdomainForm_CategoryCombo
    groups: Array<Group>
    label: string
    options: Record<string, Record<string, any>>
    subtitle: string
}
