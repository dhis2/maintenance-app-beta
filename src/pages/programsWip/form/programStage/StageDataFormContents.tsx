import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    Field,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
} from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import {
    ModelTransfer,
    RenderingOptionsSelect,
    SectionedFormSection,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import css from '../../../../components/metadataFormControls/ModelTransfer/ModelTransfer.module.css'
import { DataElement } from '../../../../types/generated'

type ProgramStageDataElementFormValue = {
    id?: string
    dataElement: DataElement
    valueType: string
    compulsory: boolean
    displayInReports: boolean
    allowFutureDate: boolean
    skipAnalytics: boolean
    skipSynchronization: boolean
    renderType: {
        MOBILE: { type: string }
        DESKTOP: { type: string }
    }
}

const getValueType = (psde: ProgramStageDataElementFormValue): string =>
    psde.valueType ?? psde.dataElement?.valueType

const defaultRenderType = {
    MOBILE: { type: 'DEFAULT' },
    DESKTOP: { type: 'DEFAULT' },
}

export const StageDataFormContents = React.memo(function StageDataFormContents({
    name,
}: {
    name: string
}) {
    const { input, meta } = useField<ProgramStageDataElementFormValue[]>(
        'programStageDataElements',
        {
            multiple: true,
            validateFields: [],
        }
    )

    const stageHasDateDataElements = input.value.some(
        (psde) => getValueType(psde) === 'DATE'
    )

    return (
        <SectionedFormSection name={name}>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Program stage data', { nsSeparator: '~:~' })}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure data collection for events in this program stage.'
                    )}
                </StandardFormSectionDescription>
                <Field
                    error={meta.invalid}
                    validationText={
                        (meta.touched && meta.error?.toString()) || ''
                    }
                    name={name}
                    className={css.moduleTransferField}
                >
                    <ModelTransfer
                        selected={input.value.map((psde) => psde.dataElement)}
                        onChange={({ selected }) => {
                            const existingDataElementsMap = new Map(
                                input.value.map((psde) => [
                                    psde.dataElement.id,
                                    psde,
                                ])
                            )

                            const selectedDataElements = selected.map((de) => {
                                const existing = existingDataElementsMap.get(
                                    de.id
                                )
                                if (existing) {
                                    return {
                                        ...existing,
                                        renderType:
                                            existing.renderType ||
                                            defaultRenderType,
                                    }
                                }

                                return {
                                    dataElement: {
                                        id: de.id,
                                        displayName: de.displayName,
                                    },
                                    valueType: de.valueType,
                                    compulsory: false,
                                    displayInReports: false,
                                    allowFutureDate: false,
                                    skipAnalytics: false,
                                    skipSynchronization: false,
                                    renderType: defaultRenderType,
                                }
                            })

                            input.onChange(selectedDataElements)
                            input.onBlur()
                        }}
                        leftHeader={i18n.t('Available data elements')}
                        rightHeader={i18n.t('Selected data elements')}
                        filterPlaceholder={i18n.t(
                            'Filter available data elements'
                        )}
                        filterPlaceholderPicked={i18n.t(
                            'Filter selected data elements'
                        )}
                        maxSelections={Infinity}
                        enableOrderChange={false}
                        query={{
                            resource: 'dataElements',
                            params: {
                                fields: ['id', 'displayName', 'valueType'],
                                filter: ['domainType:eq:TRACKER'],
                            },
                        }}
                    />
                </Field>
            </StandardFormSection>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Configure data items')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Data elements can be collected in different ways with different options.'
                    )}
                </StandardFormSectionDescription>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCellHead>{i18n.t('Name')}</TableCellHead>
                            <TableCellHead>{i18n.t('Required')}</TableCellHead>
                            <TableCellHead>
                                {i18n.t('Display in reports')}
                            </TableCellHead>
                            {stageHasDateDataElements && (
                                <TableCellHead>
                                    {i18n.t('Future date')}
                                </TableCellHead>
                            )}
                            <TableCellHead>
                                {i18n.t('Skip in analytics')}
                            </TableCellHead>
                            <TableCellHead>{i18n.t('Skip sync')}</TableCellHead>
                            <TableCellHead>
                                {i18n.t('Desktop Display')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Mobile Display')}
                            </TableCellHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {input.value.map((dataElement, index) => {
                            const dataElementId = dataElement.dataElement.id
                            const isDateType =
                                getValueType(dataElement) === 'DATE'
                            const rowKey = dataElement.id || dataElementId

                            return (
                                <TableRow key={rowKey}>
                                    <TableCell>
                                        {dataElement.dataElement.displayName}
                                    </TableCell>
                                    <TableCell>
                                        <FieldRFF
                                            component={CheckboxFieldFF}
                                            name={`programStageDataElements[${index}].compulsory`}
                                            type="checkbox"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FieldRFF
                                            component={CheckboxFieldFF}
                                            name={`programStageDataElements[${index}].displayInReports`}
                                            type="checkbox"
                                        />
                                    </TableCell>
                                    {stageHasDateDataElements && (
                                        <TableCell>
                                            <FieldRFF
                                                component={CheckboxFieldFF}
                                                name={`programStageDataElements[${index}].allowFutureDate`}
                                                type="checkbox"
                                                disabled={!isDateType}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <FieldRFF
                                            component={CheckboxFieldFF}
                                            name={`programStageDataElements[${index}].skipAnalytics`}
                                            type="checkbox"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FieldRFF
                                            component={CheckboxFieldFF}
                                            name={`programStageDataElements[${index}].skipSynchronization`}
                                            type="checkbox"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <RenderingOptionsSelect
                                            fieldName="programStageDataElements"
                                            index={index}
                                            device="DESKTOP"
                                            valueType={dataElement.valueType}
                                            required
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <RenderingOptionsSelect
                                            fieldName="programStageDataElements"
                                            index={index}
                                            device="MOBILE"
                                            valueType={dataElement.valueType}
                                            required
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </StandardFormSection>
        </SectionedFormSection>
    )
})
