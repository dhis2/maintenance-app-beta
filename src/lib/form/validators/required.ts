import i18n from '@dhis2/d2-i18n'

export const required = <Value>(value: Value) => {
    if (value) {
        return
    }

    return i18n.t('Required')
}
