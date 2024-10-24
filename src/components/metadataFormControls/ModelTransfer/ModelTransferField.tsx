import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Field, TransferProps } from '@dhis2/ui'
import React, { useRef } from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { DisplayableModel, ModelTransfer } from '../../../components'
import { getSectionNewPath } from '../../../lib'
import { PlainResourceQuery } from '../../../types'
import { LinkButton } from '../../LinkButton'
import css from './ModelTransfer.module.css'

// this currently does not need a generic, because the value of the field is not passed
// or available from props. However if it's made available,
// the generic of <TModel extends DisplayableModel> should be added.
type ModelTransferFieldProps = {
    name: string
    query: PlainResourceQuery
    label?: string
} & Pick<
    TransferProps,
    | 'rightHeader'
    | 'leftHeader'
    | 'rightFooter'
    | 'leftFooter'
    | 'filterPlaceholder'
    | 'filterPlaceholderPicked'
>

export function ModelTransferField({
    name,
    query,
    label,
    rightHeader,
    leftHeader,
    rightFooter,
    leftFooter,
    filterPlaceholder,
    filterPlaceholderPicked,
}: ModelTransferFieldProps) {
    const modelName = query.resource
    const { input, meta } = useField<DisplayableModel[]>(name, {
        multiple: true,
        validateFields: [],
    })
    console.log(input, 'input')
    const newLink = useHref(`/${getSectionNewPath(modelName)}`)

    const modelTransferHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <Field
            dataTest="formfields-modeltransfer"
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={name}
            label={label}
            className={css.moduleTransferField}
        >
            <ModelTransfer
                ref={modelTransferHandle}
                filterPlaceholder={
                    filterPlaceholder || i18n.t('Filter available items')
                }
                filterPlaceholderPicked={
                    filterPlaceholderPicked || i18n.t('Filter selected items')
                }
                selected={input.value}
                onChange={({ selected }) => {
                    input.onChange(selected)
                    input.onBlur()
                }}
                leftHeader={<TransferHeader>{leftHeader}</TransferHeader>}
                rightHeader={<TransferHeader>{rightHeader}</TransferHeader>}
                leftFooter={
                    leftFooter ?? (
                        <DefaultTransferLeftFooter
                            onRefreshClick={modelTransferHandle.current.refetch}
                            newLink={newLink}
                        />
                    )
                }
                rightFooter={rightFooter}
                query={query}
                height={'350px'}
                optionsWidth="500px"
                selectedWidth="500px"
                enableOrderChange={true}
            />
        </Field>
    )
}

const TransferHeader = ({ children }: { children: React.ReactNode }) => {
    if (typeof children === 'string') {
        return <div className={css.modelTransferHeader}>{children}</div>
    }
    return <>{children}</>
}

const DefaultTransferLeftFooter = ({
    onRefreshClick,
    newLink,
}: {
    onRefreshClick: () => void
    newLink: string
}) => {
    return (
        <ButtonStrip className={css.modelTransferFooter}>
            <Button small onClick={onRefreshClick}>
                {i18n.t('Refresh list')}
            </Button>

            <LinkButton small href={newLink} target="_blank">
                {i18n.t('Add new')}
            </LinkButton>
        </ButtonStrip>
    )
}
