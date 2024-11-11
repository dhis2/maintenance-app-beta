import { useCallback, useEffect, useMemo } from 'react'
import {
    useQueryParam,
    createEnumParam,
    withDefault,
    UrlUpdateType,
} from 'use-query-params'
import { useSectionedFormContext } from './SectionedFormContext'

type UseSelectedSectionSetHandlerOptions = {
    scroll?: boolean
    urlUpdateType?: UrlUpdateType
    scrollOptions?: ScrollIntoViewOptions
}

type UseSelectedSectionSetHandler = (
    newValue: string,
    options?: UseSelectedSectionSetHandlerOptions
) => void

const defaultSetHandlerOptions: UseSelectedSectionSetHandlerOptions = {
    scroll: false,
    urlUpdateType: 'replaceIn',
    scrollOptions: { behavior: 'smooth' },
}

export const FORM_SECTION_PARAM_KEY = 'section'

export const getSectionSearchParam = (section: string) => {
    return `${FORM_SECTION_PARAM_KEY}=${section}`
}

export const scrollToSection = (
    section: string,
    scrollOptions?: ScrollOptions
) => {
    document.getElementById(section)?.scrollIntoView(scrollOptions)
}

export const useSelectedSection = () => {
    const { sections } = useSectionedFormContext()

    const paramConfig = useMemo(
        () =>
            withDefault(
                createEnumParam(sections.map((s) => s.name)),
                sections[0].name
            ),
        [sections]
    )

    const [selected, originalHandler] = useQueryParam(
        FORM_SECTION_PARAM_KEY,
        paramConfig,
        {
            removeDefaultsFromUrl: true,
        }
    )
    // wrap handler to provide ability to scroll to section
    const setHandler: UseSelectedSectionSetHandler = useCallback(
        (newValue, options) => {
            const { scroll, scrollOptions, urlUpdateType } = {
                ...defaultSetHandlerOptions,
                ...options,
            }
            originalHandler(newValue, urlUpdateType)
            if (scroll) {
                scrollToSection(newValue, scrollOptions)
            }
        },
        [originalHandler]
    )
    return [selected, setHandler] as const
}

/**
 * Update the selected section (in searchParams) based on the section that is in view
 * This keeps the selected section in sync with the section that is in view.
 */
export const useUpdateSelectedSectionOnScroll = () => {
    const { sections } = useSectionedFormContext()
    const [selected, setSection] = useSelectedSection()

    useEffect(() => {
        // scroll to section on initial render based on search-param
        document
            .getElementById(selected)
            ?.scrollIntoView({ behavior: 'instant' })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const sectionElements = sections
            .map((section) => document.getElementById(section.name))
            .filter((s) => !!s)
        const currentInView = new Set<string>()
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        currentInView.add(entry.target.id)
                    } else {
                        currentInView.delete(entry.target.id)
                    }
                })
                const firstSectionInView = sections.find((s) =>
                    currentInView.has(s.name)
                )
                if (firstSectionInView) {
                    setSection(firstSectionInView.name)
                }
            },
            { threshold: 0.6 }
        )
        sectionElements.forEach((section) => {
            observer.observe(section)
        })

        return () => {
            observer.disconnect()
        }
    }, [sections, setSection])
}
