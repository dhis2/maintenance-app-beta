import i18n from "@dhis2/d2-i18n";

export interface LinkItem {
    to: string;
    label: string;
}

export interface ParentLink {
    label: string;
    links: LinkItem[];
}

export type SidebarLinks = Record<string, ParentLink>;

export const sidebarLinks = {
    categories: {
        label: i18n.t("Categories"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/categories",
            },
            {
                label: i18n.t("Category Options"),
                to: "categoryOptions",
            },
            {
                label: i18n.t("Category combination"),
                to: "categoryCombination",
            },
            {
                label: i18n.t("Category Option Combination"),
                to: "categoryOptionCombination",
            },
        ],
    },
    dataElements: {
        label: i18n.t("Data elements"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/dataElements",
            },
            {
                label: i18n.t("Data element groups"),
                to: "dataElementGroups",
            },
            {
                label: i18n.t("Data element group set"),
                to: "dataElementGroupSets",
            },
        ],
    },
    dataSets: {
        label: i18n.t("Data sets"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/dataSets",
            },
        ],
    },
    indicators: {
        label: i18n.t("Indicators"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/indicators",
            },
        ],
    },
    organisationUnits: {
        label: i18n.t("Organisation units"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/organisationUnits",
            },
        ],
    },
    programsAndTracker: {
        label: i18n.t("Programs and tracker"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/programs",
            },
        ],
    },
    validation: {
        label: i18n.t("Validation"),
        links: [
            {
                label: i18n.t("Overview"),
                to: "overview/validation",
            },
        ],
    }
} satisfies SidebarLinks;
