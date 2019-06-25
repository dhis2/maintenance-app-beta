export const INTERNAL_LINKS = {
    'list/dataElementSection/dataElement': true,
}

const EXTERNAL_URL =
    process.env.NODE_ENV === 'production'
        ? // eslint-disable-next-line
          location.href
              .replace(/#.*$/, '')
              .replace('maintenance2', 'maintenance')
        : // eslint-disable-next-line
          location.host

const isInternal = href => INTERNAL_LINKS.hasOwnProperty(href)

export const createUrl = href =>
    isInternal(href) ? INTERNAL_LINKS[href] : `${EXTERNAL_URL}#${href}`
