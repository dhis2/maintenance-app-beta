import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { ModelTransfer } from '../../../components'
import { DisplayableModel } from '../../../types/models'
import css from './DataSetElementModelTransfer.module.css'

type DataSetElement = {
    categoryCombo?: { id: string; name: string; displayName: string }
    dataElement: { id: string; displayName: string }
}

export function DataSetElementsModelTransferField() {
    const name = 'dataSetElements'
    const { input, meta } = useField<
        DataSetElement[],
        HTMLElement,
        (DisplayableModel & DataSetElement)[]
    >(name, {
        multiple: true,
        validateFields: [],
        format: (dses) =>
            dses.map((dse) => ({
                id: dse?.dataElement?.id,
                displayName: dse?.dataElement?.displayName,
                ...dse,
            })),
        parse: (val) =>
            val.map((de) => ({ id: de.id, dataElement: { ...de } })),
    })

    return (
        <Field
            dataTest="formfields-modeltransfer"
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={name}
            label={''}
            className={css.moduleTransferField}
        >
            <ModelTransfer
                selected={input.value}
                onChange={({ selected }) => {
                    input.onChange(selected)
                    input.onBlur()
                }}
                leftHeader={i18n.t('Available data elements')}
                rightHeader={i18n.t('Selected data elements')}
                filterPlaceholder={i18n.t('Search available data elements')}
                filterPlaceholderPicked={i18n.t(
                    'Search selected data elements'
                )}
                query={{
                    resource: 'dataElements',
                    params: {
                        filter: 'domainType:eq:AGGREGATE',
                    },
                }}
                maxSelections={Infinity}
            />
        </Field>
    )
}
