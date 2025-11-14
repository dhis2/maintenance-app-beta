import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { DisplayableModel } from '../../../types/models'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const ProgramStageField = ({ prefix }: RelationshipSideFieldsProps) => {
    const programStageName = `${prefix}Constraint.programStage`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined
    const program = formValues[`${prefix}Constraint`]?.program

    const { input: programStageInput } = useField(programStageName)
    const { input: dataElementsInput } = useField(
        `${prefix}Constraint.dataElements`
    )

    const visible = constraint === 'PROGRAM_STAGE_INSTANCE' && !!program?.id

    const programStageQuery = useMemo(() => {
        if (!visible) {
            return null
        }
        return {
            resource: 'programStages',
            params: {
                fields: [
                    'id',
                    'displayName',
                    'programStageDataElements[id,dataElement[id,displayName]]',
                ],
                filter: [`program.id:eq:${program.id}`],
                order: 'displayName:iasc',
                paging: false,
            },
        }
    }, [visible, program?.id])

    useEffect(() => {
        if (!visible && programStageInput.value) {
            programStageInput.onChange(undefined)
        }
    }, [visible, programStageInput])

    if (!visible || !programStageQuery) {
        return null
    }

    return (
        <StandardFormField>
            <ModelSingleSelectFormField<DisplayableModel>
                name={programStageName}
                label={i18n.t('Program stage')}
                query={programStageQuery}
                required
                inputWidth="330px"
                onChange={() => {
                    if (
                        Array.isArray(dataElementsInput.value) &&
                        dataElementsInput.value.length
                    ) {
                        dataElementsInput.onChange([])
                    }
                }}
            />
        </StandardFormField>
    )
}
