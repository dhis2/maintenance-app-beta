/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { MapView } from './MapView'
import type { Interpretation } from './Interpretation'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Map = {
    access: Access
    attributeValues: Array<AttributeValue>
    basemap: string
    code: string
    created: string
    createdBy: User
    description: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    id: string
    interpretations: Array<Interpretation>
    lastUpdated: string
    lastUpdatedBy: User
    latitude: number
    longitude: number
    mapViews: Array<MapView>
    name: string
    sharing: Sharing
    shortName: string
    subscribed: boolean
    subscribers: Array<string>
    title: string
    translations: Array<Translation>
    user: User
    zoom: number
}
