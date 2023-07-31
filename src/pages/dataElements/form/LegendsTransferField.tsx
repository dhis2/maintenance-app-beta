import i18n from '@dhis2/d2-i18n'
import { ButtonStrip, Button, Field, Transfer } from '@dhis2/ui'
import React, { useState } from 'react'
import classes from './LegendsTransferField.module.css'

export function LegendsTransferField({
    name,
    options,
    selected,
    onRefreshLegends,
    onAddNewLegends,
    onChange,
    error,
    helpText,
    validationText,
}: {
    name: string,
    options: Array<{
        value: string,
        label: string,
    }>,
    selected: Array<string>,
    onRefreshLegends: () => void,
    onAddNewLegends: () => void,
    onChange: ({ selected }: { selected: Array<string> }) => void,
    error?: boolean,
    helpText?: string,
    validationText?: string,
}) {
    const [searchTerm, setSearchTerm] = useState('')

    const rightHeader = (
        <p className={classes.legendsPickedHeader}>
            {i18n.t('Selected legends')}
        </p>
    )

    const leftFooter = (
        <div className={classes.legendsOptionsFooter}>
            <ButtonStrip>
                <Button small onClick={onRefreshLegends}>
                    {i18n.t('Refresh list')}
                </Button>

                <Button small onClick={onAddNewLegends}>
                    {i18n.t('Add new')}
                </Button>
            </ButtonStrip>
        </div>
    )

    return (
        <Field
            helpText={helpText}
            error={error}
            validationText={validationText}
            name={name}
        >
            <Transfer
                enableOrderChange
                filterable
                options={options}
                selected={selected}
                onChange={onChange}
                searchTerm={searchTerm}
                filterPlaceholder={i18n.t('Filter available legends')}
                onFilterChange={({ value }: { value: string }) => setSearchTerm(value)}
                rightHeader={rightHeader}
                leftFooter={leftFooter}
            />
        </Field>
    )
}
