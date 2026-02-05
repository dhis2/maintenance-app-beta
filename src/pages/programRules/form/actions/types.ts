/**
 * Shape of a program rule action as stored in the form and API.
 * id is optional - backend generates it for new actions.
 * access?: Access so the item is compatible with ListItem (ListInFormItem uses it for Translate).
 */
import type { Access } from '../../../../types/models'

export type ProgramRuleActionFormValues = Partial<ProgramRuleActionListItem> & {
    programRule?: { id: string }
}

export type ProgramRuleActionListItem = {
    id?: string
    programRuleActionType?: string
    priority?: number
    content?: string
    data?: string
    location?: string
    dataElement?: { id: string; displayName?: string }
    trackedEntityAttribute?: { id: string; displayName?: string }
    programStage?: { id: string; displayName?: string }
    programStageSection?: { id: string; displayName?: string }
    option?: { id: string; displayName?: string }
    optionGroup?: { id: string; displayName?: string }
    templateUid?: string
    access?: Access
    deleted?: boolean
}
