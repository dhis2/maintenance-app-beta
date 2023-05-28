/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DataElement } from './DataElement'
import type { Option } from './Option'
import type { OptionGroup } from './OptionGroup'
import type { ProgramIndicator } from './ProgramIndicator'
import type { ProgramRule } from './ProgramRule'
import type { ProgramStage } from './ProgramStage'
import type { ProgramStageSection } from './ProgramStageSection'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramRuleAction = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    content: string
    created: string
    createdBy: User
    data: string
    dataElement: DataElement
    displayContent: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    location: string
    name: string
    option: Option
    optionGroup: OptionGroup
    programIndicator: ProgramIndicator
    programRule: ProgramRule
    programRuleActionEvaluationEnvironments: Array<'WEB' | 'ANDROID'>
    programRuleActionEvaluationTime: ProgramRuleAction.programRuleActionEvaluationTime
    programRuleActionType: ProgramRuleAction.programRuleActionType
    programStage: ProgramStage
    programStageSection: ProgramStageSection
    sharing: Sharing
    templateUid: string
    trackedEntityAttribute: TrackedEntityAttribute
    translations: Array<Translation>
    user: User
}

export namespace ProgramRuleAction {
    export enum programRuleActionEvaluationTime {
        ON_DATA_ENTRY = 'ON_DATA_ENTRY',
        ON_COMPLETE = 'ON_COMPLETE',
        ALWAYS = 'ALWAYS',
    }

    export enum programRuleActionType {
        DISPLAYTEXT = 'DISPLAYTEXT',
        DISPLAYKEYVALUEPAIR = 'DISPLAYKEYVALUEPAIR',
        HIDEFIELD = 'HIDEFIELD',
        HIDESECTION = 'HIDESECTION',
        HIDEPROGRAMSTAGE = 'HIDEPROGRAMSTAGE',
        ASSIGN = 'ASSIGN',
        SHOWWARNING = 'SHOWWARNING',
        WARNINGONCOMPLETE = 'WARNINGONCOMPLETE',
        SHOWERROR = 'SHOWERROR',
        ERRORONCOMPLETE = 'ERRORONCOMPLETE',
        CREATEEVENT = 'CREATEEVENT',
        SETMANDATORYFIELD = 'SETMANDATORYFIELD',
        SENDMESSAGE = 'SENDMESSAGE',
        SCHEDULEMESSAGE = 'SCHEDULEMESSAGE',
        HIDEOPTION = 'HIDEOPTION',
        SHOWOPTIONGROUP = 'SHOWOPTIONGROUP',
        HIDEOPTIONGROUP = 'HIDEOPTIONGROUP',
    }
}
