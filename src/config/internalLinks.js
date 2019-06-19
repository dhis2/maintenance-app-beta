export const INTERNAL_LINKS = {
    'list/dataElementSection/dataElement': true,
}

// eslint-disable-next-line
const EXTERNAL_URL = location.href
    .replace(/#.*$/, '')
    .replace('maintenance2', 'maintenance')

const isInternal = href =>
    INTERNAL_LINKS.hasOwnProperty(href)

export const createUrl = href => 
    isInternal(href)
        ? INTERNAL_LINKS[href]
        : `${EXTERNAL_URL}#${href}`
