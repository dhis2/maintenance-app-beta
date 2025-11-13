import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo } from 'react'
import { useFormState, useForm } from 'react-final-form'
import { StandardFormField, ModelTransferField } from '../../../components'
import { useBoundResourceQueryFn } from '../../../lib'
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

    const queryFn = useBoundResourceQueryFn()

    // Determine source: program attributes or tracked entity type attributes
    const attributesQuery = useMemo(() => {
        if (constraint === 'PROGRAM_INSTANCE' && program?.id) {
            return {
                resource: 'programs',
                id: program.id,
                params: {
                    fields: [
                        'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName]]',
                    ],
                },
            }
        }
        if (constraint === 'TRACKED_ENTITY_INSTANCE' && trackedEntityType?.id) {
            return {
                resource: 'trackedEntityTypes',
                id: trackedEntityType.id,
                params: {
                    fields: [
                        'trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName]]',
                    ],
                },
            }
        }
        return null
    }, [constraint, program, trackedEntityType])

    const queryKey = useMemo(
        () => (attributesQuery ? [attributesQuery] : ['skip', prefix]),
        [attributesQuery, prefix]
    )

    const { data } = useQuery({
        queryKey: queryKey as any,
        queryFn: queryFn<{
            programTrackedEntityAttributes?: Array<{
                trackedEntityAttribute: { id: string; displayName: string }
            }>
            trackedEntityTypeAttributes?: Array<{
                trackedEntityAttribute: { id: string; displayName: string }
            }>
        }>,
        enabled: !!attributesQuery && visible,
    })

    const availableAttributes = useMemo(() => {
        if (!data) {
            return []
        }
        if (
            constraint === 'PROGRAM_INSTANCE' &&
            data.programTrackedEntityAttributes
        ) {
            return data.programTrackedEntityAttributes.map(
                (pta) => pta.trackedEntityAttribute
            )
        }
        if (
            constraint === 'TRACKED_ENTITY_INSTANCE' &&
            data.trackedEntityTypeAttributes
        ) {
            return data.trackedEntityTypeAttributes.map(
                (teta) => teta.trackedEntityAttribute
            )
        }
        return []
    }, [data, constraint])

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

    // Use a transfer list with available attributes
    const attributeIds = availableAttributes.map((a) => a.id).join(',')

    return (
        <StandardFormField>
            <ModelTransferField
                name={attributesName}
                label={i18n.t('Tracked entity attributes')}
                query={{
                    resource: 'trackedEntityAttributes',
                    params: {
                        fields: ['id', 'displayName'],
                        ...(attributeIds
                            ? { filter: [`id:in:[${attributeIds}]`] }
                            : {}),
                        order: 'displayName:iasc',
                    },
                }}
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
