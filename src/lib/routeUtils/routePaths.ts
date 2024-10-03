import type { Section } from '../../lib'

export const routePaths = {
    overviewRoot: 'overview',
    sectionNew: 'new',
} as const

export const getOverviewPath = (section: Section) => {
    return `${routePaths.overviewRoot}/${section.namePlural}`
}

export const getSectionPath = (section: Section | string) => {
    if (typeof section === 'string') {
        return section
    }
    return section.namePlural
}

export const getSectionNewPath = (section: Section | string) => {
    return `${getSectionPath(section)}/${routePaths.sectionNew}`
}
