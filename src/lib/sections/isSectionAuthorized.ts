import { useCallback } from 'react'
import {
    SECTIONS_MAP,
    isSchemaSection,
    Section,
    isNonSchemaSection,
} from '../../constants'
import { useSchemas } from '../schemas'
import { ModelSchemas } from '../useLoadApp'
import { canCreate, useCurrentUserAuthorities } from '../user'

type UserAuthorities = ReturnType<typeof useCurrentUserAuthorities>

export function isSectionAuthorized(
    section: Section,
    userAuthorities: UserAuthorities,
    schemas: ModelSchemas
): boolean {
    if (isSchemaSection(section)) {
        const schema = schemas[section.name]
        return canCreate(schema.authorities, userAuthorities)
    } else if (isNonSchemaSection(section)) {
        if (!section.authorities) {
            return true
        }
        return canCreate(section.authorities, userAuthorities)
    } else {
        // overview section
        // check that any of the child sections are authorized
        return Object.values(SECTIONS_MAP)
            .filter((section) => section.parentSectionKey === section.name)
            .some((section) =>
                isSectionAuthorized(section, userAuthorities, schemas)
            )
    }
}

export const useIsSectionAuthorizedPredicate = () => {
    const userAuthorities = useCurrentUserAuthorities()
    const schemas = useSchemas()
    const isSectionAuthorizedPredicate = useCallback(
        (section: Section) => {
            return isSectionAuthorized(section, userAuthorities, schemas)
        },
        [schemas, userAuthorities]
    )

    return isSectionAuthorizedPredicate
}
