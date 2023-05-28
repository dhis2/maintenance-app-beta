/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOperation } from './AddOperation'
import type { RemoveByIdOperation } from './RemoveByIdOperation'
import type { RemoveOperation } from './RemoveOperation'
import type { ReplaceOperation } from './ReplaceOperation'

export type JsonPatch = {
    operations: Array<
        AddOperation | RemoveOperation | RemoveByIdOperation | ReplaceOperation
    >
}
