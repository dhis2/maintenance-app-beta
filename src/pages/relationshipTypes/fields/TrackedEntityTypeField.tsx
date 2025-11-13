import i18n from '@dhis2/d2-i18n'
import React, { useEffect } from 'react'
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

    useEffect(() => {
        if (!visible && trackedEntityTypeInput.value) {
            trackedEntityTypeInput.onChange(undefined)
        }
    }, [visible, trackedEntityTypeInput])

    if (!visible) {
        return null
    }

    return (
        <StandardFormField>
            <EditableFieldWrapper
                onRefresh={() => refresh()}
                onAddNew={() => window.open(newTrackedEntityTypeLink, '_blank')}
            >
                <div style={{ width: '400px' }}>
                    <ModelSingleSelectFormField<DisplayableModel>
                        name={trackedEntityTypeName}
                        label={i18n.t('Tracked entity type')}
                        query={{
                            resource: 'trackedEntityTypes',
                            params: {
                                fields: ['id', 'displayName'],
                                order: 'displayName:iasc',
                            },
                        }}
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
                </div>
            </EditableFieldWrapper>
        </StandardFormField>
    )
}
