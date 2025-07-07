import { NoticeBox } from '@dhis2/ui'
import React, { useMemo } from 'react'
import {
    FormProps,
    FormRenderProps,
    Form as ReactFinalForm,
} from 'react-final-form'
import { defaultValueFormatter } from '../../lib/form/'
import {
    PartialAttributeValue,
    getAllAttributeValues,
    useCustomAttributesQuery,
} from '../../lib/models/attributes'
import { LoadingSpinner } from '../loading/LoadingSpinner'

type MaybeModelWithAttributes = {
    id?: string
    name?: string
    attributeValues?: PartialAttributeValue[] | undefined
}

type OwnProps<TValues = Record<string, unknown>> = {
    initialValues: Partial<TValues> | undefined
    children: FormProps<TValues>['children']
    includeAttributes?: boolean
    // we cant remove these props due to FormProps definition, but set to never to avoid confusion
    // since we're override this and just use children props
    render?: never
    component?: never
}

export type FormBaseProps<TValues> = FormProps<TValues> & OwnProps<TValues>

export function FormBase<TInitialValues extends MaybeModelWithAttributes>({
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

    const { children } = reactFinalFormProps

    // by defualt we wrap children and add form
    // but if it's a function - we let the consumer override it
    const defaultRender =
        typeof children === 'function'
            ? children
            : ({ handleSubmit }: FormRenderProps<TInitialValues>) => (
                  <form onSubmit={handleSubmit}>{children}</form>
              )

    return (
        <ReactFinalForm<TInitialValues>
            validateOnBlur={true}
            initialValues={initialValuesWithAttributes}
            onSubmit={(values, form) => onSubmit(valueFormatter(values), form)}
            validate={(values) =>
                validate ? validate(valueFormatter(values)) : undefined
            }
            {...reactFinalFormProps}
        >
            {defaultRender}
        </ReactFinalForm>
    )
}
