import { RelationshipTypeFormValues } from './relationshipTypeSchema'

/**
 * Transform relationship type form values before submitting to API.
 * This matches maintenance-app behavior where program is excluded from posted value
 * for event programs (WITHOUT_REGISTRATION) when constraint is PROGRAM_STAGE_INSTANCE.
 * See maintenance-app: relationshipType.js line 74-75, 292-294
 */
export function transformRelationshipTypeForApi(
    values: RelationshipTypeFormValues | Partial<RelationshipTypeFormValues>
): RelationshipTypeFormValues {
    const transformed = { ...values } as RelationshipTypeFormValues

    // Process fromConstraint
    const fromConstraint = transformed.fromConstraint as
        | (typeof transformed.fromConstraint & {
              program?: { programType?: string }
          })
        | undefined
    if (
        fromConstraint?.relationshipEntity === 'PROGRAM_STAGE_INSTANCE' &&
        fromConstraint?.program?.programType === 'WITHOUT_REGISTRATION'
    ) {
        // Exclude program from posted value for event programs
        // Only programStage should be sent
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { program: _program, ...rest } = fromConstraint
        transformed.fromConstraint = rest as typeof transformed.fromConstraint
    }

    // Process toConstraint
    const toConstraint = transformed.toConstraint as
        | (typeof transformed.toConstraint & {
              program?: { programType?: string }
          })
        | undefined
    if (
        toConstraint?.relationshipEntity === 'PROGRAM_STAGE_INSTANCE' &&
        toConstraint?.program?.programType === 'WITHOUT_REGISTRATION'
    ) {
        // Exclude program from posted value for event programs
        // Only programStage should be sent
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { program: _program, ...rest } = toConstraint
        transformed.toConstraint = rest as typeof transformed.toConstraint
    }

    return transformed
}
