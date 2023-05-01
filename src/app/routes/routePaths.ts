import type { Section } from '../../constants/sections';

export const routePaths = {
    overviewRoot: "/overview",
} as const;

export const getOverviewPath = (section: Section) => {
    return `${routePaths.overviewRoot}/${section.namePlural}`;
};

export const getSectionPath = (section: Section) => {
    return section.namePlural
}
