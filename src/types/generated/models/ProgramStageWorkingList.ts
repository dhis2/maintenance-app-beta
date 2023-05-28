/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ProgramStageQueryCriteria } from './ProgramStageQueryCriteria'
import type { Program } from './Program'
import type { ProgramStage } from './ProgramStage'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramStageWorkingList = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    displayDescription: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    program: Program
    programStage: ProgramStage
    programStageQueryCriteria: ProgramStageQueryCriteria
    sharing: Sharing
    translations: Array<Translation>
    user: User
}
