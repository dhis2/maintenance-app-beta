import { useCallback } from 'react'
import {
    SECTIONS_MAP,
    isSchemaSection,
    Section,
    isNonSchemaSection,
    SchemaSection,
} from '../../constants'
import { useSchemas } from '../schemas'
import { useSystemSetting } from '../systemSettings'
import { ModelSchemas } from '../useLoadApp'
import {
    canCreate,
    hasCreateAuthority,
    isNonCreateableSchema,
    useCurrentUserAuthorities,
} from '../user'
type UserAuthorities = ReturnType<typeof useCurrentUserAuthorities>

const isNonCreateableSection = (section: Section): section is SchemaSection => {
    return isSchemaSection(section) && isNonCreateableSchema(section.name)
}

/**
 * Checks if a model can be created in a section
 * Note that this is different from being authorized to view the section
 * Since authoritzation depends on systemSetting keyRequiredAddToView
 */

function canCreateModelInSection(
    section: Section,
    userAuthorities: UserAuthorities,
    schemas: ModelSchemas
): boolean {
    if (isSchemaSection(section)) {
        const schema = schemas[section.name]

        return canCreate(schema, userAuthorities)
    } else if (isNonSchemaSection(section)) {
        if (!section.authorities) {
            return true
        }
        return hasCreateAuthority(section.authorities, userAuthorities)
    } else {
        // overview section
        // check that any of the child sections are authorized
        return Object.values(SECTIONS_MAP)
            .filter((section) => section.parentSectionKey === section.name)
            .some((section) =>
                canCreateModelInSection(section, userAuthorities, schemas)
            )
    }
}

/**
 * Authorization (ie if a section should be viewable) of a section is determined by the following:
 *  - the user must have any CREATE authority on the schema
 *  - if systemSetting keyRequireAddToView is false, sections are always authorized
 *  - overviewSections are authorized if any of their child sections are authorized
 * Returns a predicate because it's more versatile than a direct hook, since the
 * check can be used in loops.
 * @returns a predicate that can be used to check if a section is authorized
 */
export const useIsSectionAuthorizedPredicate = () => {
    const userAuthorities = useCurrentUserAuthorities()
    const schemas = useSchemas()
    const requireCreateAuthToView = useSystemSetting('keyRequireAddToView')

    const isSectionAuthorizedPredicate = useCallback(
        (section: Section) => {
            if (!requireCreateAuthToView) {
                return true
            }
            // if schema is non-creatable, we still need to check authority for creation
            // but circumvent the check for nonCreateableSchemas that is done in canCreate
            // - since the section should still be viewable
            if (isNonCreateableSection(section)) {
                return hasCreateAuthority(
                    schemas[section.name].authorities,
                    userAuthorities
                )
            }
            return canCreateModelInSection(section, userAuthorities, schemas)
        },
        [schemas, userAuthorities, requireCreateAuthToView]
    )

    return isSectionAuthorizedPredicate
}

export const useCanCreateModelInSection = (section: Section) => {
    const userAuthorities = useCurrentUserAuthorities()
    const schemas = useSchemas()

    return canCreateModelInSection(section, userAuthorities, schemas)
}
