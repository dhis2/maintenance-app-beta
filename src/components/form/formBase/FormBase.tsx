import { NoticeBox } from '@dhis2/ui'
import React, { useCallback, useMemo } from 'react'
import {
    FormProps,
    FormRenderProps,
    Form as ReactFinalForm,
} from 'react-final-form'
import { defaultValueFormatter } from '../../../lib/form/'
import { EnhancedOnSubmit } from '../../../lib/form/useOnSubmit'
import {
    PartialAttributeValue,
    getAllAttributeValues,
    useCustomAttributesQuery,
} from '../../../lib/models/attributes'
import { LoadingSpinner } from '../../loading/LoadingSpinner'
import { FormBaseProvider, useFormBaseContextValue } from './FormBaseContext'

type MaybeModelWithAttributes = {
    id?: string
    name?: string
    attributeValues?: PartialAttributeValue[]
}

type OwnProps<TValues = Record<string, unknown>> = {
    initialValues: Partial<TValues> | undefined
    children: FormProps<TValues>['children']
    includeAttributes?: boolean
    // we cant remove these props due to FormProps definition, but set to never to avoid confusion
    // since we're override this and just use children props
    render?: never
    component?: never
    valueFormatter?: (values: TValues) => TValues
    onSubmit: EnhancedOnSubmit<TValues>
}

export type FormBaseProps<TValues> = Omit<FormProps<TValues>, 'onSubmit'> &
    OwnProps<TValues>

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
    const contextValue = useFormBaseContextValue()

    const initialValuesWithAttributes = useMemo(() => {
        if (!includeAttributes || !initialValues) {
            return initialValues
        }
        return {
            ...initialValues,
            attributeValues: getAllAttributeValues(
                initialValues.attributeValues ?? [],
                customAttributes.data ?? []
            ),
        }
    }, [customAttributes.data, initialValues, includeAttributes])

    const ffSubmit: FormProps<TInitialValues>['onSubmit'] = useCallback(
        (values, form) => {
            return onSubmit(valueFormatter(values), form, {
                submitAction: contextValue.submitActionRef.current,
            })
        },
        [onSubmit, valueFormatter, contextValue.submitActionRef]
    )

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
        <FormBaseProvider value={contextValue}>
            <ReactFinalForm<TInitialValues>
                validateOnBlur={true}
                initialValues={initialValuesWithAttributes}
                onSubmit={ffSubmit}
                validate={(values) =>
                    validate ? validate(valueFormatter(values)) : undefined
                }
                {...reactFinalFormProps}
            >
                {defaultRender}
            </ReactFinalForm>
        </FormBaseProvider>
    )
}
