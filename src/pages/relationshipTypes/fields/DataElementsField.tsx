import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { StandardFormField } from '../../../components'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import { BaseModelTransfer } from '../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import {
    DefaultTransferLeftFooter,
    TransferHeader,
} from '../../../components/metadataFormControls/ModelTransfer/ModelTransfer'
import { Program } from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'
import {
    ConstraintValue,
    RelationshipSideFieldsProps,
    ProgramStageWithDataElements,
} from './types'

export const DataElementsField = ({ prefix }: RelationshipSideFieldsProps) => {
    const constraintFieldName = `${prefix}Constraint.relationshipEntity`
    const programFieldName = `${prefix}Constraint.program`
    const programStageFieldName = `${prefix}Constraint.programStage`
    const trackerDataViewPath = `${prefix}Constraint.trackerDataView.dataElements`

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
    const {
        input: { value: programStage },
    } = useField<ProgramStageWithDataElements | undefined>(
        programStageFieldName,
        {
            subscription: { value: true },
        }
    )

    const newDataElementLink = useHref('/dataElements/new')
    const refreshProgramStage = useRefreshModelSingleSelect({
        resource: 'programStages',
    })

    const effectiveProgramStage = useMemo<
        ProgramStageWithDataElements | undefined
    >(() => {
        if (
            program?.programType === 'WITHOUT_REGISTRATION' &&
            program?.programStages &&
            program.programStages.length > 0
        ) {
            return program.programStages[0] as ProgramStageWithDataElements
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
                ?.map((psde) => psde.dataElement)
                .filter((de): de is DisplayableModel => !!de) || []
        )
    }, [effectiveProgramStage])

    const { input: dataElementsInput, meta } = useField<
        string[],
        HTMLElement,
        DisplayableModel[]
    >(trackerDataViewPath, {
        format: (value) =>
            Array.isArray(value)
                ? value
                      .map((id) =>
                          availableDataElements.find((de) => de.id === id)
                      )
                      .filter((de): de is DisplayableModel => !!de)
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
                label={i18n.t('Data elements')}
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
                    maxSelections={Infinity}
                />
            </Field>
        </StandardFormField>
    )
}
