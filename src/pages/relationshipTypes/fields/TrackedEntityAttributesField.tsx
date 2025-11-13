import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useMemo } from 'react'
import { useFormState, useForm } from 'react-final-form'
import { StandardFormField, ModelTransferField } from '../../../components'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const TrackedEntityAttributesField = ({
    prefix,
}: RelationshipSideFieldsProps) => {
    const attributesName = `${prefix}Constraint.trackedEntityAttributes`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined
    const trackedEntityType =
        formValues[`${prefix}Constraint`]?.trackedEntityType
    const program = formValues[`${prefix}Constraint`]?.program

    const visible = useMemo(() => {
        if (!constraint) {
            return false
        }
        if (constraint === 'PROGRAM_STAGE_INSTANCE') {
            return false
        }
        if (constraint === 'TRACKED_ENTITY_INSTANCE' && trackedEntityType?.id) {
            return true
        }
        if (constraint === 'PROGRAM_INSTANCE' && program?.id) {
            return true
        }
        return false
    }, [constraint, trackedEntityType, program])

    const query = useMemo(() => {
        if (!visible) {
            // Return a query with empty filter array when not visible
            return {
                resource: 'trackedEntityAttributes',
                params: {
                    filter: [],
                    fields: ['id', 'displayName'],
                    order: 'displayName:iasc',
                },
            }
        }

        if (constraint === 'PROGRAM_INSTANCE' && program?.id) {
            return {
                resource: 'trackedEntityAttributes',
                params: {
                    filter: [
                        `programTrackedEntityAttributes.program.id:eq:${program.id}`,
                    ],
                    fields: ['id', 'displayName'],
                    order: 'displayName:iasc',
                },
            }
        }

        if (constraint === 'TRACKED_ENTITY_INSTANCE' && trackedEntityType?.id) {
            return {
                resource: 'trackedEntityAttributes',
                params: {
                    filter: [
                        `trackedEntityTypeAttributes.trackedEntityType.id:eq:${trackedEntityType.id}`,
                    ],
                    fields: ['id', 'displayName'],
                    order: 'displayName:iasc',
                },
            }
        }

        // Return a query with empty filter array if no constraint matches
        return {
            resource: 'trackedEntityAttributes',
            params: {
                filter: [],
                fields: ['id', 'displayName'],
                order: 'displayName:iasc',
            },
        }
    }, [visible, constraint, program?.id, trackedEntityType?.id])

    const form = useForm()

    useEffect(() => {
        if (!visible && form) {
            const attributesValue = form.getFieldState(attributesName)?.value
            if (attributesValue !== undefined && attributesValue !== null) {
                form.change(attributesName, [])
            }
        }
    }, [visible, attributesName, form])

    if (!visible) {
        return null
    }

    return (
        <StandardFormField>
            <ModelTransferField
                name={attributesName}
                label={i18n.t('Tracked entity attributes')}
                query={query}
                leftHeader={i18n.t('Available tracked entity attributes')}
                rightHeader={i18n.t('Selected tracked entity attributes')}
                filterPlaceholder={i18n.t('Search available attributes')}
                filterPlaceholderPicked={i18n.t('Search selected attributes')}
                enableOrderChange
                optionsWidth="45%"
                selectedWidth="45%"
            />
        </StandardFormField>
    )
}
