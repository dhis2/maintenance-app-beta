/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Mention } from './Mention'
import type { DataSet } from './DataSet'
import type { Ref_EventChart } from './Ref_EventChart'
import type { Ref_EventReport } from './Ref_EventReport'
import type { EventVisualization } from './EventVisualization'
import type { Ref_InterpretationComment } from './Ref_InterpretationComment'
import type { Map } from './Map'
import type { OrganisationUnit } from './OrganisationUnit'
import type { User } from './User'
import type { Visualization } from './Visualization'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Interpretation = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    comments: Array<Ref_InterpretationComment>
    created: string
    createdBy: User
    dataSet: DataSet
    displayName: string
    eventChart: Ref_EventChart
    eventReport: Ref_EventReport
    eventVisualization: EventVisualization
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    likedBy: Array<User>
    likes: number
    map: Map
    mentions: Array<Mention>
    organisationUnit: OrganisationUnit
    period: string
    sharing: Sharing
    text: string
    translations: Array<Translation>
    type: Interpretation.type
    user: User
    visualization: Visualization
}

export namespace Interpretation {
    export enum type {
        VISUALIZATION = 'VISUALIZATION',
        EVENT_VISUALIZATION = 'EVENT_VISUALIZATION',
        MAP = 'MAP',
        EVENT_REPORT = 'EVENT_REPORT',
        EVENT_CHART = 'EVENT_CHART',
        DATASET_REPORT = 'DATASET_REPORT',
    }
}
