import type { Access } from '../../../../types/models'

export type ProgramRuleActionFormValues = Partial<ProgramRuleActionListItem>

export type ProgramRuleActionListItem = {
    id: string
    programRuleActionType?: string
    priority?: number
    content?: string
    data?: string
    location?: string
    dataElement?: { id: string; displayName?: string }
    trackedEntityAttribute?: { id: string; displayName?: string }
    programRuleVariable?: { id: string; displayName?: string }
    programStage?: { id: string; displayName?: string }
    programStageSection?: { id: string; displayName?: string }
    option?: { id: string; displayName?: string }
    optionGroup?: { id: string; displayName?: string }
    notificationTemplate?: { id: string; displayName?: string }
    access?: Access
    deleted?: boolean
}
