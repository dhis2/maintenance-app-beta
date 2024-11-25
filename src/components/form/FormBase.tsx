import { NoticeBox } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { FormProps, Form as ReactFinalForm } from 'react-final-form'
import { defaultValueFormatter } from '../../lib/form/useOnSubmit'
import {
    PartialAttributeValue,
    getAllAttributeValues,
} from '../../lib/models/attributes'
import { LoadingSpinner } from '../loading/LoadingSpinner'
import { useCustomAttributesQuery } from './attributes'

type MaybeModelWithAttributes = {
    id?: string
    name?: string
    attributeValues?: PartialAttributeValue[] | undefined
}

type OwnProps<TValues = Record<string, unknown>> = {
    initialValues: TValues | undefined
    children: React.ReactNode
    includeAttributes?: boolean
}

type FormBaseProps<TValues> = FormProps<TValues> & OwnProps<TValues>

export function FormBase<TInitialValues extends MaybeModelWithAttributes>({
    children,
    initialValues,
    onSubmit,
    validate,
    valueFormatter = defaultValueFormatter,
    includeAttributes = true,
    ...reactFinalFormProps
}: FormBaseProps<TInitialValues>) {
    const customAttributes = useCustomAttributesQuery({
        enabled: includeAttributes,
    })

    const initialValuesWithAttributes = useMemo(() => {
        if (!includeAttributes || !initialValues) {
            return initialValues
        }
        return {
            ...initialValues,
            attributeValues: getAllAttributeValues(
                initialValues.attributeValues || [],
                customAttributes.data || []
            ),
        }
    }, [customAttributes.data, initialValues, includeAttributes])

    if (customAttributes.error) {
        return <NoticeBox error title="Failed to load custom attributes" />
    }

    if (!initialValuesWithAttributes || customAttributes.loading) {
        return <LoadingSpinner />
    }

    return (
        <ReactFinalForm<TInitialValues>
            validateOnBlur={true}
            initialValues={initialValuesWithAttributes}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>{children}</form>
            )}
            onSubmit={(values, form) => onSubmit(valueFormatter(values), form)}
            validate={(values) =>
                validate ? validate(valueFormatter(values)) : undefined
            }
            {...reactFinalFormProps}
        />
    )
}
