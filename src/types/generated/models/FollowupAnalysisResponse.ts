/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FollowupAnalysisMetadata } from './FollowupAnalysisMetadata'
import type { FollowupValue } from './FollowupValue'

export type FollowupAnalysisResponse = {
    followupValues: Array<FollowupValue>
    metadata: FollowupAnalysisMetadata
}
