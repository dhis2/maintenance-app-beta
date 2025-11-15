import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useHref } from 'react-router'
import { StandardFormField } from '../../../components'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import { BaseModelTransfer } from '../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import {
    DefaultTransferLeftFooter,
    TransferHeader,
} from '../../../components/metadataFormControls/ModelTransfer/ModelTransfer'
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
    const refreshProgramStage = useRefreshModelSingleSelect({
        resource: 'programStages',
    })

    const { input: dataElementsInput, meta } = useField<DisplayableModel[]>(
        dataElementsName,
        {
            multiple: true,
            validateFields: [],
        }
    )

    const visible =
        constraint === 'PROGRAM_STAGE_INSTANCE' &&
        !!program?.id &&
        !!programStage?.id

    const availableDataElements = useMemo<DisplayableModel[]>(() => {
        if (!programStage?.programStageDataElements) {
            return []
        }
        return programStage.programStageDataElements
            .map((psde: { dataElement?: DisplayableModel }) => psde.dataElement)
            .filter(
                (de: DisplayableModel | undefined): de is DisplayableModel =>
                    !!de
            )
    }, [programStage?.programStageDataElements])

    useEffect(() => {
        if (
            !visible &&
            Array.isArray(dataElementsInput.value) &&
            dataElementsInput.value.length > 0
        ) {
            dataElementsInput.onChange([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, dataElementsInput.value])

    const handleChange = useCallback(
        ({ selected }: { selected: DisplayableModel[] }) => {
            dataElementsInput.onChange(selected)
            dataElementsInput.onBlur()
        },
        [dataElementsInput]
    )

    if (!visible) {
        return null
    }

    return (
        <StandardFormField>
            <Field
                error={meta.invalid}
                validationText={(meta.touched && meta.error?.toString()) || ''}
                name={dataElementsName}
                helpText={i18n.t(
                    'Choose which data elements are shown when viewing the relationship'
                )}
            >
                <BaseModelTransfer<DisplayableModel>
                    available={availableDataElements}
                    selected={dataElementsInput.value || []}
                    onChange={handleChange}
                    leftHeader={
                        <TransferHeader>
                            {i18n.t('Available data elements')}
                        </TransferHeader>
                    }
                    rightHeader={
                        <TransferHeader>
                            {i18n.t('Selected data elements')}
                        </TransferHeader>
                    }
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
                    filterable
                    filterablePicked
                    enableOrderChange
                    optionsWidth="45%"
                    selectedWidth="45%"
                />
            </Field>
        </StandardFormField>
    )
}
