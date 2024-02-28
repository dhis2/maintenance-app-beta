export type PublicAccessPart = {
    read: boolean
    write: boolean
}
export type PublicAccess = {
    metadata: PublicAccessPart
    data: PublicAccessPart
}

const parseAccessPart = (accessPart: string): PublicAccessPart => {
    const canRead = accessPart[0] === 'r'
    return {
        read: canRead,
        write: canRead && accessPart[1] === 'w',
    }
}

// metadata is first part, data second, rest (other) parts are not used
// eg. rw------ = metadata: rw, data: --
const publicAccessRegex = /^(r-|rw|--)(r-|rw|--)(-){4}$/

export const parsePublicAccessString = (
    publicAccess: string
): PublicAccess | null => {
    const matches = publicAccess.match(publicAccessRegex)
    if (!matches) {
        return null
    }
    const [, metadata, data] = matches

    return {
        metadata: parseAccessPart(metadata),
        data: parseAccessPart(data),
    }
}

const accessPartToString = (accessPart: PublicAccessPart): string => {
    if (accessPart.write) {
        return 'rw'
    }
    return accessPart.read ? 'r-' : '--'
}

export const formatPublicAccess = (publicAccess: PublicAccess): string => {
    const metadata = accessPartToString(publicAccess.metadata)
    const data = accessPartToString(publicAccess.data)

    return metadata + data + '----'
}
