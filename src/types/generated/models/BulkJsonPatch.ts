/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JsonPatch } from './JsonPatch'

export type BulkJsonPatch = {
    patch: JsonPatch
    targetIds: Record<string, Array<string>>
}
