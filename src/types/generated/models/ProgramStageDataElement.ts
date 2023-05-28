/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DataElement } from './DataElement'
import type { ProgramStage } from './ProgramStage'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramStageDataElement = {
    access: Access
    allowFutureDate: boolean
    allowProvidedElsewhere: boolean
    attributeValues: Array<AttributeValue>
    code: string
    compulsory: boolean
    created: string
    createdBy: User
    dataElement: DataElement
    displayInReports: boolean
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    programStage: ProgramStage
    renderOptionsAsRadio: boolean
    /**
     * The exact type is unknown.
     * (Java type was: `org.hisp.dhis.render.DeviceRenderTypeMap<org.hisp.dhis.render.type.ValueTypeRenderingObject>`)
     */
    renderType: any
    sharing: Sharing
    skipAnalytics: boolean
    skipSynchronization: boolean
    sortOrder: number
    translations: Array<Translation>
    user: User
}
