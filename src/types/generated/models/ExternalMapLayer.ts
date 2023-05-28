/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { LegendSet } from './LegendSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ExternalMapLayer = {
    access: Access
    attributeValues: Array<AttributeValue>
    attribution: string
    code: string
    created: string
    createdBy: User
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    imageFormat: ExternalMapLayer.imageFormat
    lastUpdated: string
    lastUpdatedBy: User
    layers: string
    legendSet: LegendSet
    legendSetUrl: string
    mapLayerPosition: ExternalMapLayer.mapLayerPosition
    mapService: ExternalMapLayer.mapService
    name: string
    sharing: Sharing
    translations: Array<Translation>
    url: string
    user: User
}

export namespace ExternalMapLayer {
    export enum imageFormat {
        PNG = 'PNG',
        JPG = 'JPG',
    }

    export enum mapLayerPosition {
        BASEMAP = 'BASEMAP',
        OVERLAY = 'OVERLAY',
    }

    export enum mapService {
        WMS = 'WMS',
        TMS = 'TMS',
        XYZ = 'XYZ',
        VECTOR_STYLE = 'VECTOR_STYLE',
    }
}
