/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SourceParams } from './SourceParams'
import type { SourceRequest } from './SourceRequest'

export type Source = {
    params: SourceParams
    requests: Array<SourceRequest>
}
