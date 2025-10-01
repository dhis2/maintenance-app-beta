import i18n from '@dhis2/d2-i18n'
import { Checkbox, Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import css from './AttributesConfigurationField.module.css'

type TrackedEntityTypeAttribute = {
    mandatory: boolean
    searchable: boolean
    displayInList: boolean
    trackedEntityAttribute: {
        id: string
        displayName: string
    }
}

export function AttributesConfigurationField() {
    const { input } = useField<TrackedEntityTypeAttribute[]>(
        'trackedEntityTypeAttributes'
    )

    const attributes = input.value || []

    if (attributes.length === 0) {
        return (
            <div className={css.emptyMessage}>
                {i18n.t(
                    'No attributes selected. Please select attributes in the transfer above.'
                )}
            </div>
        )
    }

    const updateAttribute = (
        index: number,
        field: 'mandatory' | 'searchable' | 'displayInList',
        value: boolean
    ) => {
        const updatedAttributes = [...attributes]
        updatedAttributes[index] = {
            ...updatedAttributes[index],
            [field]: value,
        }
        input.onChange(updatedAttributes)
        input.onBlur()
    }

    return (
        <Field
            dataTest="formfields-attributes-configuration"
            label={i18n.t('Configure attributes')}
            helpText={i18n.t(
                'Choose which attributes to display, which are required, and which are searchable'
            )}
        >
            <div className={css.attributesContainer}>
                {attributes.map((attr, index) => (
                    <div
                        key={attr.trackedEntityAttribute.id}
                        className={css.attributeCard}
                    >
                        <div className={css.attributeContent}>
                            <span className={css.attributeName}>
                                {attr.trackedEntityAttribute.displayName}
                            </span>
                            <div className={css.checkboxGroup}>
                                <Checkbox
                                    label={i18n.t('Searchable')}
                                    checked={attr.searchable}
                                    onChange={({ checked }) =>
                                        updateAttribute(
                                            index,
                                            'searchable',
                                            checked
                                        )
                                    }
                                />
                                <Checkbox
                                    label={i18n.t('Mandatory')}
                                    checked={attr.mandatory}
                                    onChange={({ checked }) =>
                                        updateAttribute(
                                            index,
                                            'mandatory',
                                            checked
                                        )
                                    }
                                />
                                <Checkbox
                                    label={i18n.t('Display in list')}
                                    checked={attr.displayInList}
                                    onChange={({ checked }) =>
                                        updateAttribute(
                                            index,
                                            'displayInList',
                                            checked
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Field>
    )
}
