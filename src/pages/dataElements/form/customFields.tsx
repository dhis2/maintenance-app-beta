import i18n from '@dhis2/d2-i18n'
import { Field, Radio } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { ColorAndIconPicker } from '../../../components'
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
    const name = 'domain'
    const aggregateInput = useField(name, { type: 'radio', value: 'aggregate' })
    const trackerInput = useField(name, { type: 'radio', value: 'tracker' })
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
