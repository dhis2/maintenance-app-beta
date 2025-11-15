import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useMemo } from 'react'
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

    // For event programs (WITHOUT_REGISTRATION), use the first programStage from the program
    // This matches maintenance-app behavior (line 502-507 in relationshipType.js)
    const effectiveProgramStage = useMemo(() => {
        if (
            program?.programType === 'WITHOUT_REGISTRATION' &&
            program?.programStages &&
            program.programStages.length > 0
        ) {
            return program.programStages[0]
        }
        return programStage
    }, [program?.programType, program?.programStages, programStage])

    const visible =
        constraint === 'PROGRAM_STAGE_INSTANCE' &&
        !!program?.id &&
        !!effectiveProgramStage?.id

    const availableDataElements = useMemo<DisplayableModel[]>(() => {
        return (
            effectiveProgramStage?.programStageDataElements
                ?.map(
                    (psde: { dataElement?: DisplayableModel }) =>
                        psde.dataElement
                )
                .filter(
                    (
                        de: DisplayableModel | undefined
                    ): de is DisplayableModel => !!de
                ) || []
        )
    }, [effectiveProgramStage?.programStageDataElements])

    const trackerDataViewPath = `${prefix}Constraint.trackerDataView.dataElements`
    const { input: dataElementsInput, meta } = useField<
        string[],
        HTMLElement,
        DisplayableModel[]
    >(trackerDataViewPath, {
        format: (value) =>
            Array.isArray(value)
                ? availableDataElements.filter((de) => value.includes(de.id))
                : [],
        parse: (value) =>
            Array.isArray(value) ? value.map((de) => de.id) : [],
        multiple: true,
        validateFields: [],
    })

    if (!visible) {
        return null
    }

    return (
        <StandardFormField>
            <Field
                error={meta.invalid}
                validationText={(meta.touched && meta.error?.toString()) || ''}
                name={trackerDataViewPath}
                helpText={i18n.t(
                    'Choose which data elements are shown when viewing the relationship'
                )}
            >
                <BaseModelTransfer<DisplayableModel>
                    available={availableDataElements}
                    selected={dataElementsInput.value || []}
                    onChange={({ selected }) => {
                        dataElementsInput.onChange(selected)
                        dataElementsInput.onBlur()
                    }}
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
