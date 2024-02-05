import i18n from '@dhis2/d2-i18n'
import { ButtonStrip, Button, Field } from '@dhis2/ui'
import React, { useRef } from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { DataElementGroupsTransfer } from '../../../components'
import classes from './DataElementGroupsField.module.css'

/**
 *
 * DataElementGroups
 *
 */
export function DataElementGroupsField() {
    const name = 'dataElementGroups'
    const { input, meta } = useField(name, {
        multiple: true,
        format: (dataElementGroups: { id: string }[]) =>
            dataElementGroups?.map((dataElementGroups) => dataElementGroups.id),
        parse: (ids: string[]) => ids.map((id) => ({ id })),
        validateFields: [],
    })

    const newDataElementGroupsLink = useHref('/dataElementGroups/new')
    const dataElementGroupsHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    const rightHeader = (
        <p className={classes.dataElementGroupsPickedHeader}>
            {i18n.t('Selected data element groups')}
        </p>
    )

    const leftFooter = (
        <div className={classes.dataElementGroupsOptionsFooter}>
            <ButtonStrip>
                <Button small onClick={dataElementGroupsHandle.current.refetch}>
                    {i18n.t('Refresh list')}
                </Button>

                <Button
                    small
                    onClick={() =>
                        window.open(newDataElementGroupsLink, '_blank')
                    }
                >
                    {i18n.t('Add new')}
                </Button>
            </ButtonStrip>
        </div>
    )

    return (
        <Field
            dataTest="dataelementsformfields-dataElementGroupsets"
            error={!!meta.error}
            validationText={meta.error?.toString()}
            name={name}
        >
            <DataElementGroupsTransfer
                ref={dataElementGroupsHandle}
                selected={input.value}
                onChange={({ selected }) => input.onChange(selected)}
                rightHeader={rightHeader}
                leftFooter={leftFooter}
            />
        </Field>
    )
}
