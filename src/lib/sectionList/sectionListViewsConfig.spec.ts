import { modelListViewsConfig } from './sectionListViewsConfig'

test('All but specified configs must contain defaults', () => {
    // If a section should not contain the default model view config,
    // put the section name here
    const sectionsWithoutDefaults = Object
        .entries(modelListViewsConfig)
        .filter(([name]) => !([] as string[]).includes(name))

    sectionsWithoutDefaults.forEach(([, config]) => {
        expect(config.columns.available).toEqual(
            expect.arrayContaining(modelListViewsConfig.default.columns.available)
        )
        expect(config.columns.default).toEqual(
            expect.arrayContaining(modelListViewsConfig.default.columns.default)
        )
        expect(config.filters.available).toEqual(
            expect.arrayContaining(modelListViewsConfig.default.filters.available)
        )
        expect(config.filters.default).toEqual(
            expect.arrayContaining(modelListViewsConfig.default.filters.default)
        )
    })
})

test('defaults must be available', () => {
    Object.values(modelListViewsConfig).forEach(config => {
        expect(config.columns.available).toEqual(
            expect.arrayContaining(config.columns.default)
        )
        expect(config.filters.available).toEqual(
            expect.arrayContaining(config.filters.default)
        )
    })
})
