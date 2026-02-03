import i18n from '@dhis2/d2-i18n'
import { ProgramRuleAction } from '../../../../types/generated'

export const DISPLAY_WIDGET_LOCATION_OPTIONS = [
    { label: i18n.t('Feedback'), value: 'FEEDBACK' },
    { label: i18n.t('Indicators'), value: 'INDICATORS' },
] as const

export const DISPLAY_WIDGET_LOCATION_VALUES: readonly string[] = [
    'FEEDBACK',
    'INDICATORS',
] as const

export const NO_VALUE_OPTION = { value: '', label: i18n.t('(No Value)') }

/**
 * Default initial values for new program rule actions.
 * New actions get a client-only id so we can key list items.
 * Edit.tsx skips delete for ids starting with 'new-'
 */
export const createInitialValuesNew = (programRuleId: string) => ({
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    programRuleActionType: ProgramRuleAction.programRuleActionType.SHOWWARNING,
    priority: undefined,
    content: '',
    data: '',
    location: '',
    programRule: { id: programRuleId },
})

/**
 * Normalize DISPLAYTEXT/DISPLAYKEYVALUEPAIR location to FEEDBACK or INDICATORS for API consistency
 */
export function normalizeLocation(location: string | undefined): string {
    if (!location) {
        return ''
    }
    const upper = location.toUpperCase()
    return DISPLAY_WIDGET_LOCATION_VALUES.includes(upper) ? upper : location
}
