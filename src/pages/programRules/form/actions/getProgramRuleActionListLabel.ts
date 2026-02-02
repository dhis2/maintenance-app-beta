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

function joinRefs(...refs: (Ref | Ref[])[]): string {
    const flat = refs.flat().filter(Boolean) as Ref[]
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
    const dataAndField = joinRefs(dataElement, trackedEntityAttribute)
    const dataElementOnly = (
        dataElement?.displayName ??
        dataElement?.id ??
        ''
    ).trim()
    const locationOrField = location || dataAndField || i18n.t('field')

    switch (type) {
        case 'SHOWWARNING':
            return i18n
                .t('Show warning: {{content}} on {{target}}', {
                    content,
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'SHOWERROR':
            return i18n
                .t('Show error: {{content}} on {{target}}', {
                    content,
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'WARNINGONCOMPLETE':
            return i18n
                .t('Warning on complete: {{content}} on {{target}}', {
                    content,
                    target: dataElementOnly || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'ERRORONCOMPLETE':
            return i18n
                .t('Error on complete: {{content}} on {{target}}', {
                    content,
                    target: dataElementOnly || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'DISPLAYTEXT':
            return i18n
                .t('Display text: {{content}} on {{location}}', {
                    content,
                    location: locationOrField,
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'DISPLAYKEYVALUEPAIR':
            return i18n
                .t('Display key-value pair: {{content}} on {{location}}', {
                    content,
                    location: locationOrField,
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEFIELD':
            return i18n
                .t('Hide field: {{target}}', {
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'SETMANDATORYFIELD':
            return i18n
                .t('Set mandatory field: {{target}}', {
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
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
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEPROGRAMSTAGE':
            return i18n
                .t('Hide program stage: {{stage}}', {
                    stage: programStage?.displayName ?? programStage?.id ?? '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'ASSIGN': {
            const assignTarget = [
                dataElement?.displayName ?? dataElement?.id,
                content,
            ]
                .filter(Boolean)
                .join(', ')
            return i18n
                .t('Assign: {{data}} to field {{target}}', {
                    data: data || '-',
                    target: assignTarget || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        }
        case 'CREATEEVENT':
            return i18n
                .t('Create event in program stage: {{stage}}', {
                    stage: programStage?.displayName ?? programStage?.id ?? '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'SCHEDULEMESSAGE':
            return i18n
                .t('Schedule message: {{template}} at date {{data}}', {
                    template: templateUid || '-',
                    data: data || '',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'SENDMESSAGE':
            return i18n
                .t('Send message: {{template}}', {
                    template: templateUid || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEOPTION':
            return i18n
                .t('Hide option: {{option}} on {{target}}', {
                    option: option?.displayName ?? option?.id ?? '-',
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'SHOWOPTIONGROUP':
            return i18n
                .t('Show option group: {{group}} on {{target}}', {
                    group: optionGroup?.displayName ?? optionGroup?.id ?? '-',
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEOPTIONGROUP':
            return i18n
                .t('Hide option group: {{group}} on {{target}}', {
                    group: optionGroup?.displayName ?? optionGroup?.id ?? '-',
                    target: dataAndField || '-',
                    nsSeparator: '~-~',
                })
                .replace(' ~-~ ', ' ')
        default:
            return content || type || ((action as { id?: string }).id ?? '-')
    }
}
