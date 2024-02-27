import i18n from '@dhis2/d2-i18n'
import { ButtonStrip, Button, Field } from '@dhis2/ui'
import React, { useRef } from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { DataElementsTransfer } from '../../../components'
import classes from './DataElementsField.module.css'

/**
 *
 * DataElements
 *
 */
export function DataElementsField() {
    const name = 'dataElements'
    const { input, meta } = useField(name, {
        multiple: true,
        format: (dataElements: { id: string }[]) =>
            dataElements?.map((dataElements) => dataElements.id),
        parse: (ids: string[]) => ids.map((id) => ({ id })),
        validateFields: [],
    })

    const newDataElementsLink = useHref('/dataElements/new')
    const dataElementsHandle = useRef({
        refetch: () => console.error('Not initialized'),
    })

    const rightHeader = (
        <p className={classes.dataElementsPickedHeader}>
            {i18n.t('Selected data elements')}
        </p>
    )

    const leftFooter = (
        <div className={classes.dataElementsOptionsFooter}>
            <ButtonStrip>
                <Button small onClick={dataElementsHandle.current.refetch}>
                    {i18n.t('Refresh list')}
                </Button>

                <Button
                    small
                    onClick={() => window.open(newDataElementsLink, '_blank')}
                >
                    {i18n.t('Add new')}
                </Button>
            </ButtonStrip>
        </div>
    )

    return (
        <Field
            dataTest="dataelementsformfields-dataElementsets"
            error={!!meta.error}
            validationText={meta.error?.toString()}
            name={name}
        >
            <DataElementsTransfer
                ref={dataElementsHandle}
                selected={input.value}
                onChange={({ selected }) => input.onChange(selected)}
                rightHeader={rightHeader}
                leftFooter={leftFooter}
            />
        </Field>
    )
}
