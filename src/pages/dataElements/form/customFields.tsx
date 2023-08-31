import i18n from '@dhis2/d2-i18n'
import { Field, Radio, SingleSelectFieldFF } from '@dhis2/ui'
import React, { useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { ColorAndIconPicker } from '../../../components'
import {
    useSchemas,
    translateAggregationType,
    translateValueType,
} from '../../../lib'
import { useLegendSetQuery } from './hooks'
import { LegendSetTransferField } from './LegendSetTransferField'

// @TODO(custom fields): Implement me! (1)
export function ColorAndIconField() {
    const { input: colorInput } = useField('color')
    const { input: iconInput } = useField('icon')

    return (
        <Field
            label={i18n.t('Color and icon')}
            helpText={i18n.t(
                'A color and icon are helpful for identifying data elements in information-dense screens.'
            )}
        >
            <ColorAndIconPicker
                icon={iconInput.value}
                color={colorInput.value}
                onIconPick={({ icon }: { icon: string }) => {
                    iconInput.onChange(icon)
                }}
                onColorPick={({ color }: { color: string }) => {
                    colorInput.onChange(color)
                }}
            />
        </Field>
    )
}

export function DomainField() {
    const name = 'domainType'
    const aggregateInput = useField(name, { type: 'radio', value: 'AGGREGATE' })
    const trackerInput = useField(name, { type: 'radio', value: 'TRACKER' })
    const error = aggregateInput.meta.error || trackerInput.meta.error

    return (
        <Field
            required
            name={name}
            label={i18n.t('Domain (required)')}
            helpText={i18n.t(
                'A data element can either be aggregated or tracked data.'
            )}
            error={!!error}
            validationText={error}
        >
            <Radio
                {...aggregateInput.input}
                label={i18n.t('Aggregate')}
                onChange={(
                    _: object,
                    e: React.ChangeEvent<HTMLInputElement>
                ) => {
                    aggregateInput.input.onChange(e)
                }}
            />

            <Radio
                {...trackerInput.input}
                label={i18n.t('Tracker')}
                onChange={(
                    _: object,
                    e: React.ChangeEvent<HTMLInputElement>
                ) => {
                    trackerInput.input.onChange(e)
                }}
            />
        </Field>
    )
}

export function LegendSetField() {
    const name = 'legendSet'
    const legendSet = useLegendSetQuery()
    const [addingLegend, setAddingLegend] = useState(false)
    const { input, meta } = useField(name, { multiple: true })

    return (
        <>
            <LegendSetTransferField
                name={name}
                loading={legendSet.loading}
                selected={input.value}
                onChange={input.onChange}
                error={!!meta.error}
                options={legendSet.data}
                onRefreshLegends={legendSet.refetch}
                onAddNewLegends={() => setAddingLegend(true)}
            />

            {addingLegend &&
                `@TODO(DataElementForm): add Modal(?) for adding a new legend`}
        </>
    )
}

export function ValueTypeField() {
    const schemas = useSchemas()
    const { dataElement } = schemas
    const options = dataElement.properties.valueType.constants?.map(
        (constant) => ({
            value: constant,
            label: translateValueType(constant),
        })
    )

    return (
        <FieldRFF
            component={SingleSelectFieldFF}
            required
            inputWidth="400px"
            name="valueType"
            label={i18n.t('Value type (required)')}
            helpText={i18n.t('The type of data that will be recorded.')}
            options={options || []}
        />
    )
}

export function AggregationTypeField() {
    const { dataElement } = useSchemas()
    const options = dataElement.properties.aggregationType.constants?.map(
        (constant) => ({
            value: constant,
            label: translateAggregationType(constant),
        })
    )

    return (
        <FieldRFF
            component={SingleSelectFieldFF}
            required
            inputWidth="400px"
            name="aggregationType"
            label={i18n.t('Aggretation type (required)')}
            helpText={i18n.t(
                'The default way to aggregate this data element in analytics.'
            )}
            options={options || []}
        />
    )
}
