import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { ModelTransfer } from '../../../components'
import css from '../../../components/metadataFormControls/ModelTransfer/ModelTransfer.module.css'
import { DisplayableModel } from '../../../types/models'

type TrackedEntityAttribute = {
    id: string
    displayName: string
}

type TrackedEntityTypeAttribute = {
    mandatory: boolean
    searchable: boolean
    displayInList: boolean
    trackedEntityAttribute: TrackedEntityAttribute
}

export function AttributesTransferField() {
    const name = 'trackedEntityTypeAttributes'

    const { input, meta } = useField<
        TrackedEntityTypeAttribute[],
        HTMLElement,
        (DisplayableModel & TrackedEntityTypeAttribute)[]
    >(name, {
        format: (value) =>
            value?.map((teta) => ({
                id: teta.trackedEntityAttribute.id,
                displayName: teta.trackedEntityAttribute.displayName,
                mandatory: teta.mandatory,
                searchable: teta.searchable,
                displayInList: teta.displayInList,
                trackedEntityAttribute: teta.trackedEntityAttribute,
            })) || [],
        parse: (value) =>
            value?.map((item) => ({
                mandatory: item.mandatory,
                searchable: item.searchable,
                displayInList: item.displayInList,
                trackedEntityAttribute: item.trackedEntityAttribute,
            })) || [],
        multiple: true,
        validateFields: [],
    })

    return (
        <Field
            dataTest="formfields-attributes-transfer"
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={name}
            label={i18n.t('Tracked entity attributes')}
            className={css.moduleTransferField}
        >
            <ModelTransfer<
                DisplayableModel & TrackedEntityTypeAttribute,
                TrackedEntityAttribute
            >
                selected={input.value}
                onChange={({ selected }) => {
                    input.onChange(selected)
                    input.onBlur()
                }}
                transform={(attributes) => {
                    return attributes.map((attr) => ({
                        id: attr.id,
                        displayName: attr.displayName,
                        trackedEntityAttribute: attr,
                        mandatory: false,
                        searchable: false,
                        displayInList: false,
                    }))
                }}
                leftHeader={i18n.t('Available tracked entity attributes')}
                rightHeader={i18n.t('Selected tracked entity attributes')}
                filterPlaceholder={i18n.t('Search available attributes')}
                filterPlaceholderPicked={i18n.t('Search selected attributes')}
                query={{
                    resource: 'trackedEntityAttributes',
                    params: {
                        fields: ['id', 'displayName', 'valueType', 'unique'],
                        order: 'displayName:asc',
                    },
                }}
                maxSelections={Infinity}
            />
        </Field>
    )
}
