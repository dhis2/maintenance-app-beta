import i18n from '@dhis2/d2-i18n'
import React, { useCallback, useMemo } from 'react'
import { useField, useForm } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { required } from '../../../lib'
import type { Program, ProgramStage } from '../../../types/generated'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const ProgramStageField = ({ prefix }: RelationshipSideFieldsProps) => {
    const programStageName = `${prefix}Constraint.programStage`
    const constraintFieldName = `${prefix}Constraint.relationshipEntity`
    const programFieldName = `${prefix}Constraint.program`

    const {
        input: { value: constraint },
    } = useField<ConstraintValue | undefined>(constraintFieldName, {
        subscription: { value: true },
    })
    const {
        input: { value: program },
    } = useField<Program | undefined>(programFieldName, {
        subscription: { value: true },
    })

    const form = useForm()

    const visible =
        constraint === 'PROGRAM_STAGE_INSTANCE' &&
        !!program?.id &&
        program.programType !== 'WITHOUT_REGISTRATION'

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

    const clearDependentFields = useCallback(() => {
        const trackerDataViewPath = `${prefix}Constraint.trackerDataView`
        const currentTrackerDataView =
            form.getFieldState(trackerDataViewPath)?.value
        const currentAttributes = currentTrackerDataView?.attributes || []
        form.batch(() => {
            form.change(trackerDataViewPath, {
                attributes: currentAttributes,
                dataElements: [],
            })
        })
    }, [form, prefix])

    if (!visible || !programStageQuery) {
        return null
    }

    return (
        <StandardFormField>
            <ModelSingleSelectFormField<ProgramStage>
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
