/**
 * Builds the human-readable label for a program rule action in the list.
 * Needed because ListInFormItem expects displayName but actions only have type + content/refs.
 * Format e.g. "Warning on complete: <content> on <dataElement, trackedEntityAttribute>".
 * Target (the "on ..." part) includes both data element and tracked entity attribute when set.
 */
import i18n from '@dhis2/d2-i18n'

type Ref = { id: string; displayName?: string } | undefined

type ProgramRuleActionForLabel = {
    id?: string
    programRuleActionType?: string
    content?: string
    data?: string
    location?: string
    dataElement?: Ref
    trackedEntityAttribute?: Ref
    programStage?: Ref
    programStageSection?: Ref
    option?: Ref
    optionGroup?: Ref
    templateUid?: string
}

function isRef(x: Ref | Ref[] | undefined): x is Ref {
    return x !== undefined && !Array.isArray(x)
}

function joinRefs(...refs: (Ref | Ref[])[]): string {
    const flat = refs.flat().filter(isRef)
    return flat
        .map((r) => r?.displayName ?? r?.id ?? '')
        .filter(Boolean)
        .join(', ')
}

export function getProgramRuleActionListLabel(
    action: ProgramRuleActionForLabel
): string {
    const type = action.programRuleActionType ?? ''
    const content = action.content ?? ''
    const data = action.data ?? ''
    const location = action.location ?? ''
    const dataElement = action.dataElement
    const trackedEntityAttribute = action.trackedEntityAttribute
    const programStage = action.programStage
    const programStageSection = action.programStageSection
    const option = action.option
    const optionGroup = action.optionGroup
    const templateUid = action.templateUid ?? ''
    /** Data element and tracked entity attribute (both shown for e.g. WARNINGONCOMPLETE, ERRORONCOMPLETE). */
    const dataAndField = joinRefs(dataElement, trackedEntityAttribute)
    const locationOrField = location || dataAndField || i18n.t('field')

    switch (type) {
        case 'SHOWWARNING':
            return i18n
                .t('Show warning: {{content}} on {{target}}', {
                    content,
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'SHOWERROR':
            return i18n
                .t('Show error: {{content}} on {{target}}', {
                    content,
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'WARNINGONCOMPLETE':
            return i18n
                .t('Warning on complete: {{content}} on {{target}}', {
                    content,
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'ERRORONCOMPLETE':
            return i18n
                .t('Error on complete: {{content}} on {{target}}', {
                    content,
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'DISPLAYTEXT':
            return i18n
                .t('Display text: {{content}} on {{location}}', {
                    content,
                    location: locationOrField,
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'DISPLAYKEYVALUEPAIR':
            return i18n
                .t('Display key-value pair: {{content}} on {{location}}', {
                    content,
                    location: locationOrField,
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEFIELD':
            return i18n
                .t('Hide field: {{target}}', {
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'SETMANDATORYFIELD':
            return i18n
                .t('Set mandatory field: {{target}}', {
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'HIDESECTION':
            return i18n
                .t('Hide section: {{section}}', {
                    section:
                        programStageSection?.displayName ??
                        programStageSection?.id ??
                        '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEPROGRAMSTAGE':
            return i18n
                .t('Hide program stage: {{stage}}', {
                    stage: programStage?.displayName ?? programStage?.id ?? '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'ASSIGN': {
            // Include all possible assign targets: dataElement, trackedEntityAttribute, or program rule variable (content)
            const assignTarget = [
                dataElement?.displayName ?? dataElement?.id,
                trackedEntityAttribute?.displayName ??
                    trackedEntityAttribute?.id,
                content,
            ]
                .filter(Boolean)
                .join(', ')
            return i18n
                .t('Assign: {{data}} to field {{target}}', {
                    data: data || '-',
                    target: assignTarget || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        }
        case 'CREATEEVENT':
            return i18n
                .t('Create event in program stage: {{stage}}', {
                    stage: programStage?.displayName ?? programStage?.id ?? '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'SCHEDULEMESSAGE':
            return i18n
                .t('Schedule message: {{template}} at date {{data}}', {
                    template: templateUid || '-',
                    data: data || '',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'SENDMESSAGE':
            return i18n
                .t('Send message: {{template}}', {
                    template: templateUid || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEOPTION':
            return i18n
                .t('Hide option: {{option}} on {{target}}', {
                    option: option?.displayName ?? option?.id ?? '-',
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'SHOWOPTIONGROUP':
            return i18n
                .t('Show option group: {{group}} on {{target}}', {
                    group: optionGroup?.displayName ?? optionGroup?.id ?? '-',
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEOPTIONGROUP':
            return i18n
                .t('Hide option group: {{group}} on {{target}}', {
                    group: optionGroup?.displayName ?? optionGroup?.id ?? '-',
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        default:
            return content || type || ((action as { id?: string }).id ?? '-')
    }
}
