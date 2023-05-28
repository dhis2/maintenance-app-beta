/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Filter } from './Filter'

export type SourceRequest = {
    dx: Array<string>
    filters: Array<Filter>
    inputIdScheme: string
    name: string
    ou: Array<string>
    outputDataElementIdScheme: string
    outputIdScheme: string
    outputOrgUnitIdScheme: string
    pe: Array<string>
    visualization: string
}
