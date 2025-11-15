import i18n from '@dhis2/d2-i18n'
import React, { useCallback, useEffect, useMemo } from 'react'
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
    const form = useForm()
    const newProgramLink = useHref('/programs/new')
    const refresh = useRefreshModelSingleSelect({ resource: 'programs' })

    const visible =
        !!constraint &&
        (constraint === 'PROGRAM_INSTANCE' ||
            constraint === 'PROGRAM_STAGE_INSTANCE' ||
            (constraint === 'TRACKED_ENTITY_INSTANCE' &&
                !!trackedEntityType?.id))

    const isRequired = constraint !== 'TRACKED_ENTITY_INSTANCE'

    const programQuery = useMemo(() => {
        if (!visible) {
            return null
        }

        const isTrackedEntityInstance =
            constraint === 'TRACKED_ENTITY_INSTANCE' && trackedEntityType?.id
        const isProgramInstance = constraint === 'PROGRAM_INSTANCE'
        const isProgramStageInstance = constraint === 'PROGRAM_STAGE_INSTANCE'

        let fields = ['id', 'displayName', 'programType', 'trackedEntityType']
        let filters: string[] = []

        if (isTrackedEntityInstance) {
            fields = [
                'id',
                'displayName',
                'programType',
                'trackedEntityType',
                'programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]',
                'programStages[id]',
            ]
            filters = [
                'programType:eq:WITH_REGISTRATION',
                `trackedEntityType.id:eq:${trackedEntityType.id}`,
            ]
        } else if (isProgramInstance) {
            fields = [
                'id',
                'displayName',
                'programType',
                'programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]',
                'programStages[id]',
            ]
            filters = ['programType:eq:WITH_REGISTRATION']
        } else if (isProgramStageInstance) {
            fields = [
                'id',
                'displayName',
                'programType',
                'programStages[id,programStageDataElements[dataElement[id,displayName]]]',
            ]
        }

        return {
            resource: 'programs',
            params: {
                fields,
                order: 'displayName:iasc',
                ...(filters.length > 0 && { filter: filters }),
                ...((isTrackedEntityInstance ||
                    isProgramInstance ||
                    isProgramStageInstance) && { paging: false }),
            },
        }
    }, [visible, constraint, trackedEntityType?.id])

    useEffect(() => {
        if (!visible && programInput.value) {
            programInput.onChange(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, programInput.value])

    const clearDependentFields = useCallback(
        (selectedProgram: DisplayableModel | undefined) => {
            if (!selectedProgram) {
                form.batch(() => {
                    form.change(`${prefix}Constraint.programStage`, undefined)
                    form.change(
                        `${prefix}Constraint.trackerDataView.attributes`,
                        []
                    )
                    form.change(
                        `${prefix}Constraint.trackerDataView.dataElements`,
                        []
                    )
                })
                return
            }

            const program = selectedProgram as DisplayableModel & {
                programType?: string
                programStages?: DisplayableModel[]
            }

            form.batch(() => {
                // For event programs (WITHOUT_REGISTRATION), automatically set the first programStage
                // This matches maintenance-app behavior (line 280-287 in relationshipType.js)
                if (
                    program?.programType === 'WITHOUT_REGISTRATION' &&
                    program?.programStages &&
                    program.programStages.length > 0 &&
                    constraint === 'PROGRAM_STAGE_INSTANCE'
                ) {
                    form.change(
                        `${prefix}Constraint.programStage`,
                        program.programStages[0]
                    )
                } else {
                    form.change(`${prefix}Constraint.programStage`, undefined)
                }
                form.change(
                    `${prefix}Constraint.trackerDataView.attributes`,
                    []
                )
                form.change(
                    `${prefix}Constraint.trackerDataView.dataElements`,
                    []
                )
            })
        },
        [form, prefix, constraint]
    )

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
                    validate={isRequired ? required : undefined}
                    inputWidth="330px"
                    onChange={clearDependentFields}
                    showNoValueOption={!isRequired}
                />
            </EditableFieldWrapper>
        </StandardFormField>
    )
}
