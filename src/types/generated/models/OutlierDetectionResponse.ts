/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OutlierDetectionMetadata } from './OutlierDetectionMetadata'
import type { OutlierValue } from './OutlierValue'

export type OutlierDetectionResponse = {
    metadata: OutlierDetectionMetadata
    outlierValues: Array<OutlierValue>
}
