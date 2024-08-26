import i18n from '@dhis2/d2-i18n'
import { ButtonStrip, Button, Field } from '@dhis2/ui'
import React, { useRef } from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { DisplayableModel, ModelTransfer } from '../../../components'
import { getSectionNewPath } from '../../../lib'
import { PlainResourceQuery } from '../../../types'

type ModelTransferFieldProps = {
    name: string
    query: PlainResourceQuery
    label: string
}
export function ModelTransferField<TModel extends DisplayableModel>({
    name,
    query,
    label,
}: ModelTransferFieldProps) {
    const modelName = query.resource
    const { input, meta } = useField<TModel[]>(name, {
        multiple: true,
        validateFields: [],
    })
    const newLink = useHref(`/${getSectionNewPath(modelName)}`)

    const modelTransferHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    const rightHeader = <p>{i18n.t('Selected options')}</p>

    const leftFooter = (
        <div>
            <ButtonStrip>
                <Button small onClick={modelTransferHandle.current.refetch}>
                    {i18n.t('Refresh list')}
                </Button>

                <Button small onClick={() => window.open(newLink, '_blank')}>
                    {i18n.t('Add new')}
                </Button>
            </ButtonStrip>
        </div>
    )

    return (
        <Field
            dataTest="formfields-modeltransfer"
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={name}
            label={label}
        >
            <ModelTransfer
                ref={modelTransferHandle}
                filterPlaceHolder="Search"
                selected={input.value}
                onChange={({ selected }) => {
                    input.onChange(selected)
                    input.onBlur()
                }}
                rightHeader={rightHeader}
                leftFooter={leftFooter}
                query={query}
            />
        </Field>
    )
}
