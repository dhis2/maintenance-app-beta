import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useHref } from 'react-router'
import { StandardFormField, EditableFieldWrapper } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import { required } from '../../../lib'
import { DisplayableModel } from '../../../types/models'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const TrackedEntityTypeField = ({
    prefix,
}: RelationshipSideFieldsProps) => {
    const trackedEntityTypeName = `${prefix}Constraint.trackedEntityType`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined

    const { input: trackedEntityTypeInput } = useField(trackedEntityTypeName)
    const { input: programInput } = useField(`${prefix}Constraint.program`)
    const { input: programStageInput } = useField(
        `${prefix}Constraint.programStage`
    )
    const { input: attributesInput } = useField(
        `${prefix}Constraint.trackedEntityAttributes`
    )
    const { input: dataElementsInput } = useField(
        `${prefix}Constraint.dataElements`
    )
    const newTrackedEntityTypeLink = useHref('/trackedEntityTypes/new')
    const refresh = useRefreshModelSingleSelect({
        resource: 'trackedEntityTypes',
    })

    const visible = constraint === 'TRACKED_ENTITY_INSTANCE'

    // Only compute query when field is visible
    // Fetch trackedEntityTypes with trackedEntityTypeAttributes in one call
    // This matches the correct data flow where all TET data is fetched upfront
    const trackedEntityTypeQuery = useMemo(() => {
        if (!visible) {
            return null
        }
        return {
            resource: 'trackedEntityTypes',
            params: {
                fields: [
                    'id',
                    'displayName',
                    'name',
                    'trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName]]',
                ],
                order: 'displayName:iasc',
                paging: false,
            },
        }
    }, [visible])

    useEffect(() => {
        if (!visible && trackedEntityTypeInput.value) {
            trackedEntityTypeInput.onChange(undefined)
        }
    }, [visible, trackedEntityTypeInput])

    if (!visible || !trackedEntityTypeQuery) {
        return null
    }

    return (
        <StandardFormField>
            <EditableFieldWrapper
                onRefresh={() => refresh()}
                onAddNew={() => window.open(newTrackedEntityTypeLink, '_blank')}
            >
                <ModelSingleSelectFormField<DisplayableModel>
                    name={trackedEntityTypeName}
                    label={i18n.t('Tracked entity type')}
                    query={trackedEntityTypeQuery}
                    required={constraint === 'TRACKED_ENTITY_INSTANCE'}
                    inputWidth="330px"
                    validate={
                        constraint === 'TRACKED_ENTITY_INSTANCE'
                            ? required
                            : undefined
                    }
                    onChange={() => {
                        // Clear dependent fields when tracked entity type changes
                        if (programInput.value) {
                            programInput.onChange(undefined)
                        }
                        if (programStageInput.value) {
                            programStageInput.onChange(undefined)
                        }
                        if (
                            Array.isArray(attributesInput.value) &&
                            attributesInput.value.length
                        ) {
                            attributesInput.onChange([])
                        }
                        if (
                            Array.isArray(dataElementsInput.value) &&
                            dataElementsInput.value.length
                        ) {
                            dataElementsInput.onChange([])
                        }
                    }}
                />
            </EditableFieldWrapper>
        </StandardFormField>
    )
}
