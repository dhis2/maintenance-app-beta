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

    // Determine if program should be required based on constraint
    // Required for: PROGRAM_INSTANCE, PROGRAM_STAGE_INSTANCE
    // Not required for: TRACKED_ENTITY_INSTANCE (visible but optional)
    const isRequired = useMemo(() => {
        if (!visible) {
            return false
        }
        return (
            constraint === 'PROGRAM_INSTANCE' ||
            constraint === 'PROGRAM_STAGE_INSTANCE'
        )
    }, [visible, constraint])

    // Build program query with conditional filtering
    // Only compute query when field is visible
    const programQuery = useMemo(() => {
        if (!visible) {
            return null
        }

        const baseQuery: {
            resource: string
            params: {
                fields: string[]
                order: string
                filter?: string[]
                paging?: boolean
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

        // When constraint is TRACKED_ENTITY_INSTANCE, include programTrackedEntityAttributes
        // This matches the correct data flow where programs are fetched with their attributes
        if (constraint === 'TRACKED_ENTITY_INSTANCE' && trackedEntityType?.id) {
            baseQuery.params.fields = [
                'id',
                'displayName',
                'programType',
                'trackedEntityType',
                'programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]',
                'programStages[id]',
            ]
            baseQuery.params.paging = false
        }

        // When constraint is PROGRAM_INSTANCE, include programTrackedEntityAttributes
        // This matches the correct data flow where programs are fetched with their attributes
        if (constraint === 'PROGRAM_INSTANCE') {
            baseQuery.params.fields = [
                'id',
                'displayName',
                'programType',
                'programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]',
                'programStages[id]',
            ]
            baseQuery.params.paging = false
        }

        // When constraint is PROGRAM_STAGE_INSTANCE, include programStages with programStageDataElements
        if (constraint === 'PROGRAM_STAGE_INSTANCE') {
            baseQuery.params.fields = [
                'id',
                'displayName',
                'programType',
                'programStages[id,programStageDataElements[dataElement[id,displayName]]]',
            ]
            baseQuery.params.paging = false
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
    }, [visible, constraint, trackedEntityType?.id])

    useEffect(() => {
        if (!visible && programInput.value) {
            programInput.onChange(undefined)
            // Also clear validation state when field becomes hidden
            if (form) {
                form.mutators?.setFieldTouched?.(programName, false)
            }
        }
    }, [visible, programInput, form, programName])

    if (!visible || !programQuery) {
        return null
    }

    return (
        <StandardFormField>
            <EditableFieldWrapper
                onRefresh={() => refresh()}
                onAddNew={() => window.open(newProgramLink, '_blank')}
            >
                <ModelSingleSelectFormField<DisplayableModel>
                    name={programName}
                    label={i18n.t('Program')}
                    query={programQuery}
                    required={isRequired}
                    inputWidth="330px"
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
            </EditableFieldWrapper>
        </StandardFormField>
    )
}
