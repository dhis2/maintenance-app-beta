import React from 'react'
import { FormProps, Form as ReactFinalForm } from 'react-final-form'
import { PartialAttributeValue } from '../../lib/models/attributes'
import { LoadingSpinner } from '../loading/LoadingSpinner'
import { useMergeWithCustomAttributes } from './useMergeWithCustomAttributes'

type ModelWithAttributes = {
    attributeValues?: PartialAttributeValue[]
}

type OwnProps<TValues = Record<string, unknown>> = {
    initialValues: TValues | undefined
    children: React.ReactNode
}

type FormBaseProps<TValues> = FormProps<TValues> & OwnProps<TValues>

export function FormBase<TInitialValues extends ModelWithAttributes>({
    children,
    initialValues,
    ...reactFinalFormProps
}: FormBaseProps<TInitialValues>) {
    const initialValuesWithAttributes =
        useMergeWithCustomAttributes(initialValues)

    if (!initialValuesWithAttributes) {
        return <LoadingSpinner />
    }

    return (
        <ReactFinalForm<TInitialValues>
            validateOnBlur={true}
            initialValues={initialValuesWithAttributes}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>{children}</form>
            )}
            {...reactFinalFormProps}
        />
    )
}
