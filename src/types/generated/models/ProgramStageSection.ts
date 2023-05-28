/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ObjectStyle } from './ObjectStyle'
import type { DataElement } from './DataElement'
import type { ProgramIndicator } from './ProgramIndicator'
import type { ProgramStage } from './ProgramStage'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramStageSection = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    dataElements: Array<DataElement>
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
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    programIndicators: Array<ProgramIndicator>
    programStage: ProgramStage
    /**
     * The exact type is unknown.
     * (Java type was: `org.hisp.dhis.render.DeviceRenderTypeMap<org.hisp.dhis.render.type.SectionRenderingObject>`)
     */
    renderType: any
    sharing: Sharing
    shortName: string
    sortOrder: number
    style: ObjectStyle
    translations: Array<Translation>
    user: User
}
