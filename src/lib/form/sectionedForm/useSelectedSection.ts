import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
export const FORM_SUBSECTION_PARAM_KEY = 'subsection'

export const scrollToSection = (
    section: string,
    scrollOptions?: ScrollOptions
) => {
    // wait for the event loop to be cleared to ensure that the element is in the DOM
    // before scrolling to it, eg if navigating from a link
    setTimeout(
        () => document.getElementById(section)?.scrollIntoView(scrollOptions),
        0
    )
}

export const useSelectedSection = (
    sectionParamKey = FORM_SECTION_PARAM_KEY
) => {
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
        sectionParamKey,
        paramConfig
        // {
        //     removeDefaultsFromUrl: true,
        // }
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
export const useSyncSelectedSectionWithScroll = (
    sectionParamKey = FORM_SECTION_PARAM_KEY
) => {
    const { sections } = useSectionedFormContext()
    const [selectedSection, setSection] = useSelectedSection(sectionParamKey)

    useEffect(() => {
        const elem = document.getElementById(selectedSection)
        if (elem) {
            scrollToSection(selectedSection, { behavior: 'instant' })
        }
        // we only do this on first render, for links - scrollToSection should be called imperatively
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const sectionElements = sections
            .map((section) => document.getElementById(section.name))
            .filter((s) => !!s)
        const currentInView = new Map<string, IntersectionObserverEntry>()
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        currentInView.set(entry.target.id, entry)
                    } else {
                        currentInView.delete(entry.target.id)
                    }
                })
                const firstVisible = sections.find((s) =>
                    currentInView.has(s.name)
                )
                if (firstVisible) {
                    setSection(firstVisible.name)
                }
            },
            { threshold: 0.5 }
        )
        sectionElements.forEach((section) => {
            observer.observe(section)
        })

        return () => {
            observer.disconnect()
        }
    }, [sections, setSection])
}
