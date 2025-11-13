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

export const ProgramField = ({ prefix }: RelationshipSideFieldsProps) => {
    const programName = `${prefix}Constraint.program`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined
    const trackedEntityType =
        formValues[`${prefix}Constraint`]?.trackedEntityType

    const { input: programInput } = useField(programName)
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
        }
    }, [visible, programInput])

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
                        validate={
                            constraint === 'PROGRAM_INSTANCE' ||
                            constraint === 'PROGRAM_STAGE_INSTANCE' ||
                            (constraint === 'TRACKED_ENTITY_INSTANCE' &&
                                !!trackedEntityType)
                                ? required
                                : undefined
                        }
                        onChange={() => {
                            // Clear dependent fields when program changes
                            const form = programInput.meta.form
                            if (form) {
                                const programStageName = `${prefix}Constraint.programStage`
                                const attributesName = `${prefix}Constraint.trackedEntityAttributes`
                                const dataElementsName = `${prefix}Constraint.dataElements`

                                const programStageValue =
                                    form.getFieldState(programStageName)?.value
                                const attributesValue =
                                    form.getFieldState(attributesName)?.value
                                const dataElementsValue =
                                    form.getFieldState(dataElementsName)?.value

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
