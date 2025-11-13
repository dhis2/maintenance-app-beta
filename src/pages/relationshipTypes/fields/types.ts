import { getConstantTranslation } from '../../../lib'

export const CONSTRAINT_OPTIONS = [
    {
        value: 'TRACKED_ENTITY_INSTANCE',
        label: getConstantTranslation('TRACKED_ENTITY_INSTANCE'),
    },
    {
        value: 'PROGRAM_INSTANCE',
        label: getConstantTranslation('PROGRAM_INSTANCE'),
    },
    {
        value: 'PROGRAM_STAGE_INSTANCE',
        label: getConstantTranslation('PROGRAM_STAGE_INSTANCE'),
    },
]

export type ConstraintValue =
    | 'TRACKED_ENTITY_INSTANCE'
    | 'PROGRAM_INSTANCE'
    | 'PROGRAM_STAGE_INSTANCE'

export type RelationshipSideFieldsProps = {
    prefix: 'from' | 'to'
}
