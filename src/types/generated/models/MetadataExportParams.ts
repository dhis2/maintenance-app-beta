/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IdentifiableObject } from './IdentifiableObject'
import type { User } from './User'

export type MetadataExportParams = {
    classes: Array<string>
    defaultFields: Array<string>
    defaultFilter: Array<string>
    defaultOrder: Array<string>
    defaults: MetadataExportParams.defaults
    download: boolean
    exportWithDependencies: boolean
    inclusionStrategy: MetadataExportParams.inclusionStrategy
    objectExportWithDependencies: IdentifiableObject
    skipSharing: boolean
    user: User
    username: string
}

export namespace MetadataExportParams {
    export enum defaults {
        INCLUDE = 'INCLUDE',
        EXCLUDE = 'EXCLUDE',
    }

    export enum inclusionStrategy {
        ALWAYS = 'ALWAYS',
        NON_NULL = 'NON_NULL',
        NON_EMPTY = 'NON_EMPTY',
    }
}
