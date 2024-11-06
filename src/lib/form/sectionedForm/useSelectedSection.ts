import { useMemo } from 'react'
import { useQueryParam, createEnumParam, withDefault } from 'use-query-params'
import { useSectionedFormDescriptor } from './SectionedFormContext'

export const FORM_SECTION_PARAM_KEY = 'section'

export const getSectionSearchParam = (section: string) => {
    return `${FORM_SECTION_PARAM_KEY}=${section}`
}

export const useSelectedSection = () => {
    const { sections } = useSectionedFormDescriptor()

    const paramConfig = useMemo(
        () =>
            withDefault(
                createEnumParam(sections.map((s) => s.name)),
                sections[0].name
            ),
        [sections]
    )

    return useQueryParam(FORM_SECTION_PARAM_KEY, paramConfig, {
        removeDefaultsFromUrl: true,
    })
}

/* Helper to create a type-safe hook for useSelectedSection */
export const createUseSelectedSection = <
    TSection extends string,
    TDefault extends TSection
>(
    sections: TSection[],
    defaultSection: TDefault
) => {
    const queryParamType = withDefault(
        createEnumParam<TSection>(sections),
        defaultSection
    )
    const useSelectedSection = () => {
        return useQueryParam(FORM_SECTION_PARAM_KEY, queryParamType, {
            removeDefaultsFromUrl: true,
        })
    }
    return useSelectedSection
}
