import i18n from '@dhis2/d2-i18n'
import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
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
        unique: boolean
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

            <Table data-test="formfields-attributes-configuration">
                <TableHead>
                    <TableRow>
                        <TableCellHead>{i18n.t('Name')}</TableCellHead>
                        <TableCellHead>{i18n.t('Required')}</TableCellHead>
                        <TableCellHead>{i18n.t('Searchable')}</TableCellHead>
                        <TableCellHead>
                            {i18n.t('Display in list')}
                        </TableCellHead>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {attributes.map((attr, index) => (
                        <TableRow key={attr.trackedEntityAttribute.id}>
                            <TableCell>
                                {attr.trackedEntityAttribute.displayName}
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={
                                        attr.searchable ||
                                        attr.trackedEntityAttribute.unique
                                    }
                                    onChange={({ checked }) =>
                                        updateAttribute(
                                            index,
                                            'searchable',
                                            checked
                                        )
                                    }
                                    disabled={
                                        attr.trackedEntityAttribute.unique
                                    }
                                />
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
