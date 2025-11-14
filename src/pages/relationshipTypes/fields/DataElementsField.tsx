import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useEffect, useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useHref } from 'react-router'
import { StandardFormField } from '../../../components'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import { BaseModelTransfer } from '../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import { DefaultTransferLeftFooter } from '../../../components/metadataFormControls/ModelTransfer/ModelTransfer'
import { DisplayableModel } from '../../../types/models'
import { ConstraintValue, RelationshipSideFieldsProps } from './types'

export const DataElementsField = ({ prefix }: RelationshipSideFieldsProps) => {
    const dataElementsName = `${prefix}Constraint.dataElements`
    const formValues = useFormState({ subscription: { values: true } }).values
    const constraint = formValues[`${prefix}Constraint`]?.relationshipEntity as
        | ConstraintValue
        | undefined
    const program = formValues[`${prefix}Constraint`]?.program
    const programStage = formValues[`${prefix}Constraint`]?.programStage

    const newDataElementLink = useHref('/dataElements/new')
    // Refresh programStage since data elements come from programStage.programStageDataElements
    const refreshProgramStage = useRefreshModelSingleSelect({
        resource: 'programStages',
    })

    // Using useField to get direct access to the field for clearing values
    // Assumption: Following the pattern from ProgramField.tsx and ProgramStageField.tsx
    const { input: dataElementsInput, meta } = useField<DisplayableModel[]>(
        dataElementsName,
        {
            multiple: true,
            validateFields: [],
        }
    )

    // Field is only visible when constraint is PROGRAM_STAGE_INSTANCE
    // and both program and programStage are selected
    const visible = useMemo(() => {
        return (
            constraint === 'PROGRAM_STAGE_INSTANCE' &&
            !!program?.id &&
            !!programStage?.id
        )
    }, [constraint, program?.id, programStage?.id])

    // Extract data elements from programStage.programStageDataElements
    // Data is already fetched in ProgramStageField, so no extra API call needed
    const availableDataElements = useMemo<DisplayableModel[]>(() => {
        if (!programStage?.programStageDataElements) {
            return []
        }
        return programStage.programStageDataElements
            .map((psde: { dataElement: DisplayableModel }) => psde.dataElement)
            .filter((de: DisplayableModel | undefined) => !!de)
    }, [programStage?.programStageDataElements])

    // Clear data elements when field becomes hidden
    // Assumption: Following the pattern from ProgramField.tsx and ProgramStageField.tsx
    // which use input.onChange() instead of form.change()
    useEffect(() => {
        if (!visible && dataElementsInput.value) {
            // Clear array field when visibility changes to false
            if (
                Array.isArray(dataElementsInput.value) &&
                dataElementsInput.value.length > 0
            ) {
                dataElementsInput.onChange([])
            }
        }
    }, [visible, dataElementsInput])

    if (!visible) {
        return null
    }

    return (
        <StandardFormField>
            <Field
                error={meta.invalid}
                validationText={(meta.touched && meta.error?.toString()) || ''}
                name={dataElementsName}
            >
                <div style={{ marginBottom: '8px' }}>
                    {i18n.t(
                        'Choose which data elements are shown when viewing the relationship'
                    )}
                </div>
                <BaseModelTransfer<DisplayableModel>
                    available={availableDataElements}
                    selected={dataElementsInput.value || []}
                    onChange={({ selected }) => {
                        dataElementsInput.onChange(selected)
                        dataElementsInput.onBlur()
                    }}
                    leftHeader={i18n.t('Available data elements')}
                    rightHeader={i18n.t('Selected data elements')}
                    leftFooter={
                        <DefaultTransferLeftFooter
                            onRefreshClick={() => refreshProgramStage()}
                            newLink={newDataElementLink}
                        />
                    }
                    filterPlaceholder={i18n.t('Search available data elements')}
                    filterPlaceholderPicked={i18n.t(
                        'Search selected data elements'
                    )}
                    enableOrderChange
                    optionsWidth="45%"
                    selectedWidth="45%"
                />
            </Field>
        </StandardFormField>
    )
}
