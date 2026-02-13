import type {
    ProgramRuleActionFormValues,
    ProgramRuleActionListItem,
} from './types'

export const ACTION_TYPES_WITH_TEMPLATES = [
    'SENDMESSAGE',
    'SCHEDULEMESSAGE',
] as const

type ActionWithTemplateUid = ProgramRuleActionFormValues & {
    templateUid?: string
    notificationTemplate?: { id?: string; displayName?: string }
}

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

export function transformActionForApi(
    action: ProgramRuleActionFormValues
): ProgramRuleActionFormValues {
    if (!action.notificationTemplate?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { notificationTemplate, ...rest } = action
        return rest
    }

    const { notificationTemplate, ...rest } = action

    return {
        ...rest,
        templateUid: notificationTemplate.id,
    }
}

export function transformActionsFromApi(
    actions: Array<ProgramRuleActionListItem & { templateUid?: string }>
): ProgramRuleActionListItem[] {
    return actions.map((action) =>
        transformActionFromApi(action)
    ) as ProgramRuleActionListItem[]
}
