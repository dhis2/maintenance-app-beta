import i18n from '@dhis2/d2-i18n'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useField, useFormState, useForm } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { required } from '../../../lib'
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
    const form = useForm()

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, programStageInput.value])

    const clearDependentFields = useCallback(() => {
        form.batch(() => {
            form.change(`${prefix}Constraint.trackerDataView.dataElements`, [])
        })
    }, [form, prefix])

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
                validate={required}
                inputWidth="330px"
                onChange={clearDependentFields}
            />
        </StandardFormField>
    )
}
