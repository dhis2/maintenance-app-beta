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
                            const form = trackedEntityTypeInput.meta.form
                            if (form) {
                                const programName = `${prefix}Constraint.program`
                                const programStageName = `${prefix}Constraint.programStage`
                                const attributesName = `${prefix}Constraint.trackedEntityAttributes`
                                const dataElementsName = `${prefix}Constraint.dataElements`

                                const programValue =
                                    form.getFieldState(programName)?.value
                                const programStageValue =
                                    form.getFieldState(programStageName)?.value
                                const attributesValue =
                                    form.getFieldState(attributesName)?.value
                                const dataElementsValue =
                                    form.getFieldState(dataElementsName)?.value

                                if (programValue) {
                                    form.change(programName, undefined)
                                }
                                if (programStageValue) {
                                    form.change(programStageName, undefined)
                                }
                                if (
                                    Array.isArray(attributesValue) &&
                                    attributesValue.length
                                ) {
                                    form.change(attributesName, [])
                                }
                                if (
                                    Array.isArray(dataElementsValue) &&
                                    dataElementsValue.length
                                ) {
                                    form.change(dataElementsName, [])
                                }
                            }
                        }}
                    />
                </div>
            </EditableFieldWrapper>
        </StandardFormField>
    )
}
