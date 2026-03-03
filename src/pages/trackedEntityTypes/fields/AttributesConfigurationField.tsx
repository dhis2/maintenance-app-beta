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
import { TooltipWrapper } from '../../../components/tooltip'

type TrackedEntityTypeAttribute = {
    mandatory: boolean
    searchable: boolean
    displayInList: boolean
    trackedEntityAttribute: {
        id: string
        displayName: string
        unique: boolean
        valueType: string
    }
}

type UpdateAttributeFn = (
    index: number,
    field: 'mandatory' | 'searchable' | 'displayInList',
    value: boolean
) => void

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

    const updateAttribute: UpdateAttributeFn = (index, field, value) => {
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
                                <SearchableCheckbox
                                    index={index}
                                    unique={attr.trackedEntityAttribute.unique}
                                    valueType={
                                        attr.trackedEntityAttribute.valueType
                                    }
                                    isChecked={
                                        attr.searchable ||
                                        attr.trackedEntityAttribute.unique
                                    }
                                    handleCheck={updateAttribute}
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

const SearchableCheckbox = ({
    index,
    unique,
    valueType,
    isChecked,
    handleCheck,
}: {
    index: number
    unique: boolean
    valueType: string
    isChecked: boolean
    handleCheck: UpdateAttributeFn
}) => {
    const isFileType = ['IMAGE', 'FILE_RESOURCE'].includes(valueType)

    // Tooltip logic
    let tooltipContent = ''
    let showTooltip = false

    if (unique) {
        tooltipContent = i18n.t('Unique attributes are always searchable')
        showTooltip = true
    } else if (isFileType) {
        tooltipContent = i18n.t(
            'Image and File type attributes are not searchable'
        )
        showTooltip = true
    }

    const isDisabled = unique || isFileType

    return (
        <TooltipWrapper condition={showTooltip} content={tooltipContent}>
            <Checkbox
                checked={isChecked}
                onChange={({ checked }) => {
                    handleCheck(index, 'searchable', checked)
                }}
                disabled={isDisabled}
            />
        </TooltipWrapper>
    )
}
