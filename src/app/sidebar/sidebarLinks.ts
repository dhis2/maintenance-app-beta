import i18n from "@dhis2/d2-i18n";
import {
    SECTIONS_MAP,
    Section,
} from "../../constants/sections";
import { getOverviewPath, getSectionPath } from "../routes/routePaths";

export interface LinkItem {
    to: string;
    label: string;
}

export interface ParentLink {
    label: string;
    links: LinkItem[];
}

export type SidebarLinks = Record<string, ParentLink>;

const getOverviewLinkItem = (section: Section): LinkItem => ({
    label: i18n.t("Overview"),
    to: getOverviewPath(section),
});

const getSectionLinkItem = (section: Section): LinkItem => ({
    label: i18n.t(section.title),
    to: getSectionPath(section),
});

export const sidebarLinks = {
    categories: {
        label: SECTIONS_MAP.category.titlePlural,
        links: [
            getOverviewLinkItem(SECTIONS_MAP.category),
            getSectionLinkItem(SECTIONS_MAP.categoryOption),
            getSectionLinkItem(SECTIONS_MAP.category),
            getSectionLinkItem(SECTIONS_MAP.categoryCombo),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionCombo),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionGroup),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionGroupSet),
        ],
    },
    dataElements: {
        label: SECTIONS_MAP.dataElement.titlePlural,
        links: [
            getOverviewLinkItem(SECTIONS_MAP.dataElement),
            getSectionLinkItem(SECTIONS_MAP.dataElement),
            getSectionLinkItem(SECTIONS_MAP.dataElementGroup),
            getSectionLinkItem(SECTIONS_MAP.dataElementGroupSet),
        ],
    },
    dataSets: {
        label: SECTIONS_MAP.dataSet.titlePlural,
        links: [
            getOverviewLinkItem(SECTIONS_MAP.dataSet),
            getSectionLinkItem(SECTIONS_MAP.dataSet),
            getSectionLinkItem(SECTIONS_MAP.dataSetNotification),
        ],
    },
    indicators: {
        label: SECTIONS_MAP.indicator.titlePlural,
        links: [
            getOverviewLinkItem(SECTIONS_MAP.indicator),
            getSectionLinkItem(SECTIONS_MAP.indicator),
            getSectionLinkItem(SECTIONS_MAP.indicatorType),
            getSectionLinkItem(SECTIONS_MAP.indicatorGroup),
            getSectionLinkItem(SECTIONS_MAP.indicatorGroupSet),
            getSectionLinkItem(SECTIONS_MAP.programIndicator),
            getSectionLinkItem(SECTIONS_MAP.programIndicatorGroup),
        ],
    },
    organisationUnits: {
        label: SECTIONS_MAP.organisationUnit.titlePlural,
        links: [
            getOverviewLinkItem(SECTIONS_MAP.organisationUnit),
            getSectionLinkItem(SECTIONS_MAP.organisationUnit),
            getSectionLinkItem(SECTIONS_MAP.organisationUnitGroup),
            getSectionLinkItem(SECTIONS_MAP.organisationUnitGroupSet),
        ],
    },
    programsAndTracker: {
        label: SECTIONS_MAP.programsAndTracker.title,
        links: [
            getOverviewLinkItem(SECTIONS_MAP.programsAndTracker),
            getSectionLinkItem(SECTIONS_MAP.program),
            getSectionLinkItem(SECTIONS_MAP.trackedEntityType),
            getSectionLinkItem(SECTIONS_MAP.trackedEntityAttribute),
            getSectionLinkItem(SECTIONS_MAP.programRule),
            getSectionLinkItem(SECTIONS_MAP.programRuleVariable),
        ],
    },
    validation: {
        label: SECTIONS_MAP.validation.titlePlural,
        links: [
            getOverviewLinkItem(SECTIONS_MAP.validation),
            getSectionLinkItem(SECTIONS_MAP.validationRule),
            getSectionLinkItem(SECTIONS_MAP.validationRuleGroup),
            getSectionLinkItem(SECTIONS_MAP.validationNotification),
        ],
    },
} satisfies SidebarLinks;
