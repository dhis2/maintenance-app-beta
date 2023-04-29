import i18n from "@dhis2/d2-i18n";
import {
    SECTIONS_MAP,
    SectionNamePlural,
    Section,
} from "../../constants/sections";
import { getOverviewPath } from "../routes/routePaths";
export interface LinkItem {
    to: string;
    label: string;
}

export interface ParentLink {
    label: string;
    links: LinkItem[];
}

export type SidebarLinks = Record<string, ParentLink>;

const getOverviewLinkItem = (sectionName: SectionNamePlural): LinkItem => ({
    label: i18n.t("Overview"),
    to: getOverviewPath(sectionName),
});

const getSectionLinkItem = (section: Section): LinkItem => ({
    label: i18n.t(section.title),
    to: section.namePlural ?? section.name,
});

export const sidebarLinks = {
    categories: {
        label: SECTIONS_MAP.category.titlePlural,
        links: [
            getOverviewLinkItem(SECTIONS_MAP.category.name),
            getSectionLinkItem(SECTIONS_MAP.categoryOption),
            getSectionLinkItem(SECTIONS_MAP.categoryCombo),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionCombo),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionGroup),
            getSectionLinkItem(SECTIONS_MAP.categoryOptionGroupSet),
        ],
    },
    dataElements: {
        label: i18n.t("Data elements"),
        links: [
            getOverviewLinkItem(SECTIONS_MAP.dataElement.name),
            getSectionLinkItem(SECTIONS_MAP.dataElement),
            getSectionLinkItem(SECTIONS_MAP.dataElementGroup),
            getSectionLinkItem(SECTIONS_MAP.dataElementGroupSet),
        ],
    },
    dataSets: {
        label: i18n.t("Data sets"),
        links: [
            getOverviewLinkItem(SECTIONS_MAP.dataSet.name),
            getSectionLinkItem(SECTIONS_MAP.dataSet),
            getSectionLinkItem(SECTIONS_MAP.dataSetNotification),
        ],
    },
    indicators: {
        label: i18n.t("Indicators"),
        links: [
            getOverviewLinkItem(SECTIONS_MAP.indicator.name),
            getSectionLinkItem(SECTIONS_MAP.indicator),
            getSectionLinkItem(SECTIONS_MAP.indicatorType),
            getSectionLinkItem(SECTIONS_MAP.indicatorGroup),
            getSectionLinkItem(SECTIONS_MAP.indicatorGroupSet),
            getSectionLinkItem(SECTIONS_MAP.programIndicator),
            getSectionLinkItem(SECTIONS_MAP.programIndicatorGroup),
        ],
    },
    organisationUnits: {
        label: i18n.t("Organisation units"),
        links: [
            getOverviewLinkItem(SECTIONS_MAP.organisationUnit.name),
            getSectionLinkItem(SECTIONS_MAP.organisationUnit),
            getSectionLinkItem(SECTIONS_MAP.organisationUnitGroup),
            getSectionLinkItem(SECTIONS_MAP.organisationUnitGroupSet),
        ],
    },
    programsAndTracker: {
        label: i18n.t("Programs and tracker"),
        links: [
            getOverviewLinkItem(SECTIONS_MAP.programsAndTracker.name),
            getSectionLinkItem(SECTIONS_MAP.program),
            getSectionLinkItem(SECTIONS_MAP.trackedEntityType),
            getSectionLinkItem(SECTIONS_MAP.trackedEntityAttribute),
            getSectionLinkItem(SECTIONS_MAP.programRule),
            getSectionLinkItem(SECTIONS_MAP.programRuleVariable),
        ],
    },
    validation: {
        label: i18n.t("Validation"),
        links: [
            getOverviewLinkItem(SECTIONS_MAP.validation.name),
            getSectionLinkItem(SECTIONS_MAP.validationRule),
            getSectionLinkItem(SECTIONS_MAP.validationRuleGroup),
            getSectionLinkItem(SECTIONS_MAP.validationNotification),
        ],
    },
} satisfies SidebarLinks;
