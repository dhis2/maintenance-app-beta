import { Icon } from './useIconsQuery'

const match = (left: string, right: string) => {
    return left?.toLowerCase().includes(right.toLowerCase())
}

export function filterIcons(icons: Icon[], filterText: string) {
    if (!filterText) {
        return icons
    }

    return icons.filter(
        ({ key, description, keywords }) =>
            match(key, filterText) ||
            match(description, filterText) ||
            keywords?.some((keyword) => match(keyword, filterText))
    )
}
