export type ConstraintValue =
    | 'TRACKED_ENTITY_INSTANCE'
    | 'PROGRAM_INSTANCE'
    | 'PROGRAM_STAGE_INSTANCE'

export type RelationshipSideFieldsProps = {
    prefix: 'from' | 'to'
}
