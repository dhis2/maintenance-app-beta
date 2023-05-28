/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Document } from './Document'
import type { Ref_EventChart } from './Ref_EventChart'
import type { Ref_EventReport } from './Ref_EventReport'
import type { EventVisualization } from './EventVisualization'
import type { Map } from './Map'
import type { Report } from './Report'
import type { User } from './User'
import type { Visualization } from './Visualization'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DashboardItem = {
    access: Access
    appKey: string
    attributeValues: Array<AttributeValue>
    code: string
    contentCount: number
    created: string
    createdBy: User
    displayName: string
    eventChart: Ref_EventChart
    eventReport: Ref_EventReport
    eventVisualization: EventVisualization
    favorite: boolean
    favorites: Array<string>
    height: number
    href: string
    id: string
    interpretationCount: number
    interpretationLikeCount: number
    lastUpdated: string
    lastUpdatedBy: User
    map: Map
    messages: boolean
    name: string
    reports: Array<Report>
    resources: Array<Document>
    shape: DashboardItem.shape
    sharing: Sharing
    text: string
    translations: Array<Translation>
    type: DashboardItem.type
    user: User
    users: Array<User>
    visualization: Visualization
    width: number
    x: number
    y: number
}

export namespace DashboardItem {
    export enum shape {
        NORMAL = 'NORMAL',
        DOUBLE_WIDTH = 'DOUBLE_WIDTH',
        FULL_WIDTH = 'FULL_WIDTH',
    }

    export enum type {
        VISUALIZATION = 'VISUALIZATION',
        EVENT_VISUALIZATION = 'EVENT_VISUALIZATION',
        EVENT_CHART = 'EVENT_CHART',
        MAP = 'MAP',
        EVENT_REPORT = 'EVENT_REPORT',
        USERS = 'USERS',
        REPORTS = 'REPORTS',
        RESOURCES = 'RESOURCES',
        TEXT = 'TEXT',
        MESSAGES = 'MESSAGES',
        APP = 'APP',
    }
}
