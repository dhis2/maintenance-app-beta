import i18n from '@dhis2/d2-i18n'

// The category-combo model have default objects with hardcoded IDs
// having these statically defined is convenient instead of having to fetch them (eg. for default-selectors)
// https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-services/dhis-service-core/src/main/java/org/hisp/dhis/dataelement/DefaultCategoryService.java#L544

export const DEFAULT_CATEGORY_COMBO = {
    id: 'bjDvmb4bfuf',
    displayName: i18n.t('None'), // we want to display 'None' in the UI
    isDefault: true,
    name: 'default',
}

export const DEFAULT_CATEGORY = {
    id: 'GLevLNI9wkl',
    isDefault: true,
    name: 'default',
}

export const DEFAULT_CATEGORY_OPTION_COMBO = {
    id: 'HllvX50cXC0',
    name: 'default',
}

export const DEFAULT_CATEGORYCOMBO_SELECT_OPTION = {
    categories: [
        {
            ...DEFAULT_CATEGORY,
            displayName: 'default',
            dataDimensionType: 'DISAGGREGATION',
            categoryOptions: [
                {
                    displayName: 'default',
                    id: 'xYerKDKCefk',
                },
            ],
        },
    ],
    dataDimensionType: 'DISAGGREGATION',
    displayName: i18n.t('None'),
    id: 'bjDvmb4bfuf',
}
