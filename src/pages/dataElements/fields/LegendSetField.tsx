import i18n from '@dhis2/d2-i18n'
import { ButtonStrip, Button, Field } from '@dhis2/ui'
import React, { useRef } from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { LegendSetTransfer } from '../../../components'
import classes from './LegendSetField.module.css'

/**
 *
 * LegendSet
 *
 */
export function LegendSetField() {
    const name = 'legendSets'
    const { input, meta } = useField(name, {
        multiple: true,
        format: (legendSets: { id: string }[]) =>
            legendSets?.map((legendSet) => legendSet.id),
        parse: (ids: string[]) => ids.map((id) => ({ id })),
        validateFields: [],
    })

    const newLegendSetLink = useHref('/legendSets/new')
    const legendSetHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    const rightHeader = (
        <p className={classes.legendsPickedHeader}>
            {i18n.t('Selected legends')}
        </p>
    )

    const leftFooter = (
        <div className={classes.legendsOptionsFooter}>
            <ButtonStrip>
                <Button small onClick={legendSetHandle.current.refetch}>
                    {i18n.t('Refresh list')}
                </Button>

                <Button
                    small
                    onClick={() => window.open(newLegendSetLink, '_blank')}
                >
                    {i18n.t('Add new')}
                </Button>
            </ButtonStrip>
        </div>
    )

    return (
        <Field
            dataTest="formfields-legendsets"
            error={!!meta.error}
            validationText={meta.error?.toString()}
            name={name}
        >
            <LegendSetTransfer
                ref={legendSetHandle}
                selected={input.value}
                onChange={({ selected }) => input.onChange(selected)}
                rightHeader={rightHeader}
                leftFooter={leftFooter}
            />
        </Field>
    )
}
