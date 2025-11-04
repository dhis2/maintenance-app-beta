import i18n from '@dhis2/d2-i18n'
import {
    Checkbox,
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow,
    TableBody,
    TableHead,
} from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import {
    StandardFormSectionTitle,
    StandardFormSectionDescription,
} from '../../../components'

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
            <div style={{ padding: '16px', textAlign: 'center' }}>
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
        <>
            <StandardFormSectionTitle>
                {i18n.t('Configure attributes')}
            </StandardFormSectionTitle>

            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose which attributes to display, which are required, and which are searchable'
                )}
            </StandardFormSectionDescription>

            <DataTable data-test="formfields-attributes-configuration">
                <TableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>
                            {i18n.t('Attribute name')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Searchable')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Mandatory')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Display in list')}
                        </DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {attributes.map((attr, index) => (
                        <DataTableRow key={attr.trackedEntityAttribute.id}>
                            <DataTableCell>
                                {attr.trackedEntityAttribute.displayName}
                            </DataTableCell>
                            <DataTableCell>
                                <Checkbox
                                    checked={attr.searchable}
                                    onChange={({ checked }) =>
                                        updateAttribute(
                                            index,
                                            'searchable',
                                            checked
                                        )
                                    }
                                />
                            </DataTableCell>
                            <DataTableCell>
                                <Checkbox
                                    checked={attr.mandatory}
                                    onChange={({ checked }) =>
                                        updateAttribute(
                                            index,
                                            'mandatory',
                                            checked
                                        )
                                    }
                                />
                            </DataTableCell>
                            <DataTableCell>
                                <Checkbox
                                    checked={attr.displayInList}
                                    onChange={({ checked }) =>
                                        updateAttribute(
                                            index,
                                            'displayInList',
                                            checked
                                        )
                                    }
                                />
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </TableBody>
            </DataTable>
        </>
    )
}
