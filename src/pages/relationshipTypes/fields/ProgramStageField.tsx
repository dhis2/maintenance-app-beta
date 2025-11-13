import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
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

    const visible = constraint === 'PROGRAM_STAGE_INSTANCE' && !!program?.id

    const programStageQuery = useMemo(() => {
        if (!program?.id) {
            return null
        }
        return {
            resource: 'programStages',
            params: {
                fields: ['id', 'displayName'],
                filter: [`program.id:eq:${program.id}`],
                order: 'displayName:iasc',
            },
        }
    }, [program?.id])

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
            <div style={{ width: '400px' }}>
                <ModelSingleSelectFormField<DisplayableModel>
                    name={programStageName}
                    label={i18n.t('Program stage')}
                    query={programStageQuery}
                    validate={required}
                    onChange={() => {
                        // Clear data elements when program stage changes
                        const form = programStageInput.meta.form
                        if (form) {
                            const dataElementsName = `${prefix}Constraint.dataElements`
                            const dataElementsValue =
                                form.getFieldState(dataElementsName)?.value
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
        </StandardFormField>
    )
}
