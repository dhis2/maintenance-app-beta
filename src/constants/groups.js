import {
    categorySections,
    dataElementSections,
    dataSetSections,
    indicatorSections,
    organisationUnitSections,
    programSections,
    validationSections,
    otherSections,
} from './sections'

export const groups = {
    category: {
        key: 'category',
        name: 'Category',
        sections: categorySections,
    },
    dataElement: {
        key: 'dataElement',
        name: 'Data element',
        sections: dataElementSections,
    },
    dataSet: {
        key: 'dataSet',
        name: 'Data set',
        sections: dataSetSections,
    },
    indicator: {
        key: 'indicator',
        name: 'Indicator',
        sections: indicatorSections,
    },
    organisationUnit: {
        key: 'organisationUnit',
        name: 'Organisation unit',
        sections: organisationUnitSections,
    },
    program: {
        key: 'program',
        name: 'Program',
        sections: programSections,
    },
    validation: {
        key: 'validation',
        name: 'Validation',
        sections: validationSections,
    },
    other: {
        key: 'other',
        name: 'Other',
        sections: otherSections,
    },
}
