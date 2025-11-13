import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useMemo } from 'react'
import { useField, useFormState, useForm } from 'react-final-form'
import { useHref } from 'react-router'
import { StandardFormField, EditableFieldWrapper } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import { required } from '../../../lib'
import { DisplayableModel } from '../../../types/models'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const ProgramField = ({ prefix }: RelationshipSideFieldsProps) => {
    const programName = `${prefix}Constraint.program`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined
    const trackedEntityType =
        formValues[`${prefix}Constraint`]?.trackedEntityType

    const { input: programInput } = useField(programName)
    const { input: programStageInput } = useField(
        `${prefix}Constraint.programStage`
    )
    const { input: attributesInput } = useField(
        `${prefix}Constraint.trackedEntityAttributes`
    )
    const { input: dataElementsInput } = useField(
        `${prefix}Constraint.dataElements`
    )
    const form = useForm()
    const newProgramLink = useHref('/programs/new')
    const refresh = useRefreshModelSingleSelect({ resource: 'programs' })

    const visible = useMemo(() => {
        if (!constraint) {
            return false
        }
        if (
            constraint === 'PROGRAM_INSTANCE' ||
            constraint === 'PROGRAM_STAGE_INSTANCE'
        ) {
            return true
        }
        if (constraint === 'TRACKED_ENTITY_INSTANCE' && trackedEntityType?.id) {
            return true
        }
        return false
    }, [constraint, trackedEntityType])

    // Determine if program should be required based on constraint and visibility
    const isRequired = useMemo(() => {
        if (!visible) {
            return false
        }
        return (
            constraint === 'PROGRAM_INSTANCE' ||
            constraint === 'PROGRAM_STAGE_INSTANCE' ||
            (constraint === 'TRACKED_ENTITY_INSTANCE' && !!trackedEntityType)
        )
    }, [visible, constraint, trackedEntityType])

    // Build program query with conditional filtering
    const programQuery = useMemo(() => {
        const baseQuery: {
            resource: string
            params: {
                fields: string[]
                order: string
                filter?: string[]
            }
        } = {
            resource: 'programs',
            params: {
                fields: [
                    'id',
                    'displayName',
                    'programType',
                    'trackedEntityType',
                ],
                order: 'displayName:iasc',
            },
        }

        if (constraint === 'TRACKED_ENTITY_INSTANCE' && trackedEntityType?.id) {
            baseQuery.params.filter = [
                `programType:eq:WITH_REGISTRATION`,
                `trackedEntityType.id:eq:${trackedEntityType.id}`,
            ]
        } else if (constraint === 'PROGRAM_INSTANCE') {
            baseQuery.params.filter = [`programType:eq:WITH_REGISTRATION`]
        }
        // For PROGRAM_STAGE_INSTANCE, no WITH_REGISTRATION filter (include programs with stages)

        return baseQuery
    }, [constraint, trackedEntityType])

    useEffect(() => {
        if (!visible && programInput.value) {
            programInput.onChange(undefined)
            // Also clear validation state when field becomes hidden
            if (form) {
                form.mutators?.setFieldTouched?.(programName, false)
            }
        }
    }, [visible, programInput, form, programName])

    if (!visible) {
        return null
    }

    return (
        <StandardFormField>
            <EditableFieldWrapper
                onRefresh={() => refresh()}
                onAddNew={() => window.open(newProgramLink, '_blank')}
            >
                <div style={{ width: '400px' }}>
                    <ModelSingleSelectFormField<DisplayableModel>
                        name={programName}
                        label={i18n.t('Program')}
                        query={programQuery}
                        validate={(value) => {
                            // Only validate if field is visible and required
                            if (!visible) {
                                return undefined
                            }
                            if (isRequired) {
                                return required(value)
                            }
                            return undefined
                        }}
                        validateFields={[]}
                        onChange={() => {
                            // Clear dependent fields when program changes
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
