import type { ProgramRuleActionListItem } from './types'

export type DataElementWithOptionSet = {
    id: string
    displayName?: string
    optionSet?: { id: string }
}

export type TrackedEntityAttributeWithOptionSet = {
    id: string
    displayName?: string
    optionSet?: { id: string }
}

export type ProgramRuleActionFormValues = Partial<ProgramRuleActionListItem> & {
    programRule?: { id: string }
    dataElement?:
        | DataElementWithOptionSet
        | { id: string; displayName?: string }
    trackedEntityAttribute?:
        | TrackedEntityAttributeWithOptionSet
        | { id: string; displayName?: string }
}

/** Resolve option set ID from data element or tracked entity attribute for option/optionGroup selects */
export function optionSetIdFromFormValues(
    values: ProgramRuleActionFormValues
): string | undefined {
    const de = values.dataElement as DataElementWithOptionSet | undefined
    const tea = values.trackedEntityAttribute as
        | TrackedEntityAttributeWithOptionSet
        | undefined
    return de?.optionSet?.id ?? tea?.optionSet?.id
}
