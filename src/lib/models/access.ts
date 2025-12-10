import type { Access, BaseIdentifiableObject } from '../../types/generated'

export const hasWriteAccess = (access: Partial<Access>) => !!access.write
export const hasDeleteAccess = (access: Partial<Access>) => !!access.delete

export const canEditModel = (model: Pick<BaseIdentifiableObject, 'access'>) =>
    hasWriteAccess(model.access)

export const canDeleteModel = (model: Pick<BaseIdentifiableObject, 'access'>) =>
    hasDeleteAccess(model.access)

export type ParsedAccessPart = {
    read: boolean
    write: boolean
}
export type ParsedAccess = {
    metadata: ParsedAccessPart
    data: ParsedAccessPart
}

const parseAccessPart = (accessPart: string): ParsedAccessPart => {
    const canRead = accessPart[0] === 'r'
    return {
        read: canRead,
        write: canRead && accessPart[1] === 'w',
    }
}

// metadata is first part, data second, rest (other) parts are not used
// eg. rw------ = metadata: rw, data: --
const publicAccessRegex = /^(r-|rw|--)(r-|rw|--)(-){4}$/

export const parseAccessString = (
    accessString: string
): ParsedAccess | null => {
    const matches = accessString.match(publicAccessRegex)
    if (!matches) {
        return null
    }
    const [, metadata, data] = matches

    return {
        metadata: parseAccessPart(metadata),
        data: parseAccessPart(data),
    }
}

const accessPartToString = (accessPart: ParsedAccessPart): string => {
    if (accessPart.write) {
        return 'rw'
    }
    return accessPart.read ? 'r-' : '--'
}

export const formatAccessToString = (publicAccess: ParsedAccess): string => {
    const metadata = accessPartToString(publicAccess.metadata)
    const data = accessPartToString(publicAccess.data)

    return metadata + data + '----'
}

export type SharingSettings = {
    owner?: string
    external: boolean
    public?: string
    userGroups: Record<
        string,
        { id: string; access: string; displayName?: string }
    >
    users: Record<string, { id: string; access: string; displayName?: string }>
}

const sortSharingObjectPart = (
    sharingObjectPart:
        | Record<string, { id: string; access: string; displayName?: string }>
        | undefined
) => {
    if (!sharingObjectPart) {
        return sharingObjectPart
    }

    return Object.values(sharingObjectPart).sort((a, b) =>
        a.id < b.id ? -1 : 1
    )
}

export const areSharingPropertiesSimilar = (
    sharingA: SharingSettings | undefined,
    sharingB: SharingSettings | undefined
): boolean => {
    if (!sharingA || !sharingB || sharingA.public !== sharingB.public) {
        return false
    }

    if (!!sharingA.external !== !!sharingB.external) {
        return false
    }

    const sortedUsersA = sortSharingObjectPart(sharingA.users)
    const sortedUsersB = sortSharingObjectPart(sharingB.users)
    if (JSON.stringify(sortedUsersA) !== JSON.stringify(sortedUsersB)) {
        return false
    }

    const sortedGroupsA = sortSharingObjectPart(sharingA.userGroups)
    const sortedGroupsB = sortSharingObjectPart(sharingB.userGroups)
    return JSON.stringify(sortedGroupsA) === JSON.stringify(sortedGroupsB)
}
