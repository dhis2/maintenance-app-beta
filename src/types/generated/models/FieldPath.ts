/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldPathTransformer } from './FieldPathTransformer'
import type { Property } from './Property'

export type FieldPath = {
    exclude: boolean
    fullPath: string
    name: string
    path: Array<string>
    preset: boolean
    property: Property
    root: boolean
    transformer: boolean
    transformers: Array<FieldPathTransformer>
}
