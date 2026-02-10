import i18n from '@dhis2/d2-i18n'
import { ProgramRuleActionListItem } from './types'

export function getProgramRuleActionListLabel(
    action: ProgramRuleActionListItem
): string {
    const {
        programRuleActionType,
        content,
        data,
        location,
        dataElement,
        trackedEntityAttribute,
        programStage,
        programStageSection,
        option,
        optionGroup,
        templateUid,
    } = action

    const targetDeAndTea = [
        dataElement?.displayName,
        trackedEntityAttribute?.displayName,
    ]
        .filter(Boolean)
        .join(', ')
    const targetLocation = location
    const targetAssign = [
        dataElement?.displayName,
        trackedEntityAttribute?.displayName,
        content,
    ]
        .filter(Boolean)
        .join(', ')

    switch (programRuleActionType) {
        case 'SHOWWARNING':
            return i18n
                .t('Show warning: {{content}} on {{target}}', {
                    content,
                    target: targetDeAndTea || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'SHOWERROR':
            return i18n
                .t('Show error: {{content}} on {{target}}', {
                    content,
                    target: targetDeAndTea || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'WARNINGONCOMPLETE':
            return i18n
                .t('Warning on complete: {{content}} on {{target}}', {
                    content,
                    target: targetDeAndTea || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'ERRORONCOMPLETE':
            return i18n
                .t('Error on complete: {{content}} on {{target}}', {
                    content,
                    target: targetDeAndTea || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'DISPLAYTEXT':
            return i18n
                .t('Display text: {{content}} on {{location}}', {
                    content,
                    location: targetLocation,
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'DISPLAYKEYVALUEPAIR':
            return i18n
                .t('Display key-value pair: {{content}} on {{location}}', {
                    content,
                    location: targetLocation,
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEFIELD':
            return i18n
                .t('Hide field: {{target}}', {
                    target: targetDeAndTea || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'SETMANDATORYFIELD':
            return i18n
                .t('Set mandatory field: {{target}}', {
                    target: targetDeAndTea || '-',
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
            return i18n
                .t('Assign: {{data}} to field {{target}}', {
                    data: data || '-',
                    target: targetAssign || '-',
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
                    target: targetDeAndTea || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'SHOWOPTIONGROUP':
            return i18n
                .t('Show option group: {{group}} on {{target}}', {
                    group: optionGroup?.displayName ?? optionGroup?.id ?? '-',
                    target: targetDeAndTea || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        case 'HIDEOPTIONGROUP':
            return i18n
                .t('Hide option group: {{group}} on {{target}}', {
                    group: optionGroup?.displayName ?? optionGroup?.id ?? '-',
                    target: targetDeAndTea || '-',
                    nsSeparator: '~-~',
                    interpolation: { escapeValue: false },
                })
                .replace(' ~-~ ', ' ')
        default:
            return i18n.t('Unknown action type')
    }
}
