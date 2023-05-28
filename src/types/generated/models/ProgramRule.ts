/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Program } from './Program'
import type { ProgramRuleAction } from './ProgramRuleAction'
import type { ProgramStage } from './ProgramStage'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramRule = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    condition: string
    created: string
    createdBy: User
    description: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    priority: number
    program: Program
    programRuleActions: Array<ProgramRuleAction>
    programStage: ProgramStage
    sharing: Sharing
    translations: Array<Translation>
    user: User
}
