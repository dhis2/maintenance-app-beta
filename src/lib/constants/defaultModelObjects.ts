import i18n from '@dhis2/d2-i18n'

// Objects part of the category-combo model have hardcoded IDs
// having these statically defined is convenient instead of having to fetch them (eg. for default-selectors)
// https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-services/dhis-service-core/src/main/java/org/hisp/dhis/dataelement/DefaultCategoryService.java#L544

export const DEFAULT_CATEGORY_COMBO = {
    id: 'bjDvmb4bfuf',
    displayName: i18n.t('None'), // we want to display 'None' in the UI
    isDefault: true,
    name: 'default',
}
