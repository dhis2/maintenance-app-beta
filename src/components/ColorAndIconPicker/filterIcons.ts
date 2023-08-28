import { Icon } from './useIconsQuery'

export function filterIcons(icons: Icon[], filterText: string) {
    const lowerText = filterText.toLowerCase()
    return icons.filter(({ key, description, keywords }) => {
        const matchesKey = key.indexOf(lowerText) > -1
        const matchesDescription =
            description && description.toLowerCase().indexOf(lowerText) > -1
        const matchesKeyWords =
            keywords &&
            keywords.some(
                (keyword) => keyword.toLowerCase().indexOf(lowerText) > -1
            )
        return matchesKey || matchesDescription || matchesKeyWords
    })
}
