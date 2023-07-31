import i18n from '@dhis2/d2-i18n'
import { Field, Radio } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { LegendsTransferField } from './LegendsTransferField'

export function ColorAndIconField() {
    return (
        <Field
            label={i18n.t('Color and icon')}
            helpText={i18n.t('A color and icon are helpful for identifying data elements in information-dense screens.')}
        >
            @TODO(custom fields): Implement me! (1)
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
            helpText={i18n.t('A data element can either be aggregated or tracked data.')}
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

export function LegendsField({
    options,
    onRefresh,
    onAddNew,
}: {
    options: Array<{
        value: string,
        label: string,
    }>,
    onRefresh: () => void,
    onAddNew: () => void,
}) {
    const name = 'legends'
    const { input, meta } = useField(name)

    return (
        <LegendsTransferField
            name={name}
            selected={input.value}
            onChange={input.onChange}
            error={!!meta.error}
            options={options}
            onRefreshLegends={onRefresh}
            onAddNewLegends={onAddNew}
        />
    )
}
