import type { ProgramRuleFormValues } from '../fieldFilters'
import type {
    ProgramRuleActionFormValues,
    ProgramRuleActionListItem,
} from './types'

export type FormValuesWithProgramTemplates = Omit<
    ProgramRuleFormValues,
    'program'
> & { program?: ProgramWithTemplates }

export type ProgramWithTemplates = {
    id?: string
    programType?: string
    notificationTemplates?: Array<{ id: string; displayName?: string }>
    programStages?: Array<{
        notificationTemplates?: Array<{ id: string; displayName?: string }>
    }>
}

type ActionWithTemplateUid = ProgramRuleActionFormValues & {
    templateUid?: string
    notificationTemplate?: { id?: string; displayName?: string }
}

export const ACTION_TYPES_WITH_TEMPLATES = [
    'SENDMESSAGE',
    'SCHEDULEMESSAGE',
] as const

export function transformActionFromApi(
    action: ActionWithTemplateUid
): ProgramRuleActionFormValues {
    if (!action.templateUid) {
        return action
    }

    const { templateUid, notificationTemplate: apiTemplate, ...rest } = action
    return {
        ...rest,
        notificationTemplate: {
            id: templateUid,
            ...(apiTemplate?.displayName && {
                displayName: apiTemplate.displayName,
            }),
        },
    }
}

export function transformActionsFromApi(
    actions: Array<ProgramRuleActionListItem & { templateUid?: string }>
): ProgramRuleActionListItem[] {
    return actions.map(transformActionFromApi) as ProgramRuleActionListItem[]
}

function normalizeActionForApi(
    action: ProgramRuleActionFormValues
): ProgramRuleActionFormValues {
    if (!action.notificationTemplate?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip for API
        const { notificationTemplate, ...rest } = action
        return rest
    }
    const { notificationTemplate, ...rest } = action
    return { ...rest, templateUid: notificationTemplate.id }
}

export function toProgramRuleActionApiPayload(
    action: ProgramRuleActionFormValues | ProgramRuleActionListItem,
    programRuleId: string
): Record<string, unknown> {
    const transformed = normalizeActionForApi(
        action as ProgramRuleActionFormValues
    )
    const { deleted, ...apiAction } = transformed
    void deleted
    return { ...apiAction, programRule: { id: programRuleId } }
}

export function buildProgramRuleActionsForApi(
    allActions: ProgramRuleActionListItem[],
    editedActionId: string,
    editedValues: ProgramRuleActionFormValues,
    programRuleId: string
): Record<string, unknown>[] {
    const merged = allActions.map((a) =>
        a.id === editedActionId ? { ...editedValues, id: editedActionId } : a
    )
    const nonDeleted = merged.filter(
        (a) => !(a as ProgramRuleActionListItem).deleted
    )
    return nonDeleted.map((a) =>
        toProgramRuleActionApiPayload(
            a as ProgramRuleActionFormValues,
            programRuleId
        )
    )
}

export function buildTemplateNameById(
    program: ProgramWithTemplates | undefined | null
): Record<string, string> {
    if (!program) {
        return {}
    }
    const fromProgram = program.notificationTemplates ?? []
    const fromStages =
        program.programStages?.flatMap((s) => s.notificationTemplates ?? []) ??
        []
    const all = [...fromProgram, ...fromStages]
    return Object.fromEntries(
        all
            .filter((t) => t.id && t.displayName)
            .map((t) => [t.id, t.displayName!])
    )
}
