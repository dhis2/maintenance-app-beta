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

export const ACTION_TYPES_WITH_TEMPLATES = [
    'SENDMESSAGE',
    'SCHEDULEMESSAGE',
] as const

export function toProgramRuleActionApiPayload(
    action: ProgramRuleActionFormValues | ProgramRuleActionListItem,
    programRuleId: string
): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip form-only field
    const { deleted, ...apiAction } = action
    return { ...apiAction, programRule: { id: programRuleId } }
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
