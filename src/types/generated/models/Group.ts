/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Field } from './Field'

export type Group = {
    dataElementCount: number
    description: string
    fields: Array<Field>
    label: string
    /**
     * keys are class java.lang.Object
     */
    metaData: Record<string, Record<string, any>>
}
