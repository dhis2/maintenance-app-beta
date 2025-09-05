import i18n from '@dhis2/d2-i18n'
import { useMemo } from 'react'
import {
    OVERVIEW_SECTIONS,
    SECTIONS_MAP,
    Section,
    getOverviewPath,
    getSectionPath,
    useIsSectionAuthorizedPredicate,
} from '../../lib'

export interface LinkItem {
    to: string
    label: string
    section: Section
}

export interface ParentLink {
    label: string
    links: LinkItem[]
}

export type SidebarLinks = Record<string, ParentLink>

const getOverviewLinkItem = (section: Section): LinkItem => ({
    label: i18n.t('Overview'),
    to: getOverviewPath(section),
    section,
})

const getSectionLinkItem = (section: Section): LinkItem => ({
    label: i18n.t(section.title),
    to: getSectionPath(section),
    section,
})

export const sidebarLinks = {
    categories: {
        label: OVERVIEW_SECTIONS.category.titlePlural,
        links: [
            getOverviewLinkItem(OVERVIEW_SECTIONS.category),
            getSectionLinkItem(SECTIONS_MAP.categoryOption),
            getSectionLinkItem(SECTIONS_MAP.category),
            getSectionLinkItem(SECTIONS_MAP.categoryCombo),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionCombo),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionGroup),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionGroupSet),
        ],
    },
    dataElements: {
        label: OVERVIEW_SECTIONS.dataElement.titlePlural,
        links: [
            getOverviewLinkItem(OVERVIEW_SECTIONS.dataElement),
            getSectionLinkItem(SECTIONS_MAP.dataElement),
            getSectionLinkItem(SECTIONS_MAP.dataElementGroup),
            getSectionLinkItem(SECTIONS_MAP.dataElementGroupSet),
        ],
    },
    dataSets: {
        label: OVERVIEW_SECTIONS.dataSet.titlePlural,
        links: [
            getOverviewLinkItem(OVERVIEW_SECTIONS.dataSet),
            getSectionLinkItem(SECTIONS_MAP.dataSet),
            getSectionLinkItem(SECTIONS_MAP.dataSetNotificationTemplate),
        ],
    },
    indicators: {
        label: OVERVIEW_SECTIONS.indicator.titlePlural,
        links: [
            getOverviewLinkItem(OVERVIEW_SECTIONS.indicator),
            getSectionLinkItem(SECTIONS_MAP.indicator),
            getSectionLinkItem(SECTIONS_MAP.indicatorType),
            getSectionLinkItem(SECTIONS_MAP.indicatorGroup),
            getSectionLinkItem(SECTIONS_MAP.indicatorGroupSet),
            getSectionLinkItem(SECTIONS_MAP.programIndicator),
            getSectionLinkItem(SECTIONS_MAP.programIndicatorGroup),
        ],
    },
    organisationUnits: {
        label: OVERVIEW_SECTIONS.organisationUnit.titlePlural,
        links: [
            getOverviewLinkItem(OVERVIEW_SECTIONS.organisationUnit),
            getSectionLinkItem(SECTIONS_MAP.organisationUnit),
            getSectionLinkItem(SECTIONS_MAP.organisationUnitGroup),
            getSectionLinkItem(SECTIONS_MAP.organisationUnitGroupSet),
            getSectionLinkItem(SECTIONS_MAP.organisationUnitLevel),
        ],
    },
    programsAndTracker: {
        label: OVERVIEW_SECTIONS.programsAndTracker.title,
        links: [
            getOverviewLinkItem(OVERVIEW_SECTIONS.programsAndTracker),
            getSectionLinkItem(SECTIONS_MAP.program),
            getSectionLinkItem(SECTIONS_MAP.trackedEntityType),
            getSectionLinkItem(SECTIONS_MAP.trackedEntityAttribute),
            getSectionLinkItem(SECTIONS_MAP.relationshipType),
            getSectionLinkItem(SECTIONS_MAP.programRule),
            getSectionLinkItem(SECTIONS_MAP.programRuleVariable),
        ],
    },
    validation: {
        label: OVERVIEW_SECTIONS.validation.titlePlural,
        links: [
            getOverviewLinkItem(OVERVIEW_SECTIONS.validation),
            getSectionLinkItem(SECTIONS_MAP.validationRule),
            getSectionLinkItem(SECTIONS_MAP.validationRuleGroup),
            getSectionLinkItem(SECTIONS_MAP.validationNotificationTemplate),
        ],
    },
    other: {
        label: OVERVIEW_SECTIONS.other.title,
        links: [
            getOverviewLinkItem(OVERVIEW_SECTIONS.other),
            getSectionLinkItem(SECTIONS_MAP.attribute),
            getSectionLinkItem(SECTIONS_MAP.optionGroup),
            getSectionLinkItem(SECTIONS_MAP.optionGroupSet),
            getSectionLinkItem(SECTIONS_MAP.programDisaggregation),
        ],
    },
} satisfies SidebarLinks

export const useSidebarLinks = (): ParentLink[] => {
    const isSectionAuthorized = useIsSectionAuthorizedPredicate()

    return useMemo(() => {
        const authorizedSidebarLinks: ParentLink[] = Object.values(sidebarLinks)
            .map(({ label, links }) => ({
                label,
                links: links.filter(({ section }) =>
                    isSectionAuthorized(section)
                ),
            }))
            .filter(({ links }) => links.length > 0)
        return authorizedSidebarLinks
    }, [isSectionAuthorized])
}
