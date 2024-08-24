import { FormProps, Form as ReactFinalForm } from 'react-final-form'
import { useModelSectionHandleOrThrow, useOnSubmitEdit } from '../../lib'
import { AttributeValue, IdentifiableObject } from '../../types/generated'
import { getAllAttributeValues } from '../../lib/models/attributes'
import { useCustomAttributesQuery } from '../../components'
import React, { useMemo } from 'react'
import { LoadingSpinner } from '../loading/LoadingSpinner'

type OnSubmit<TValues> = FormProps<TValues>['onSubmit']

type ModelWithAttributes = IdentifiableObject & {
    attributeValues?: AttributeValue[]
}

type OwnEditFormProps<TValues = Record<string, any>> = {
    initialValues: TValues
    children: React.ReactNode
    onSubmit?: OnSubmit<TValues>
    modelId: string
}
type EditFormProps<TValues> = Omit<FormProps<TValues>, keyof OwnEditFormProps>

export function EditFormBase<TInitialValues extends ModelWithAttributes>({
    children,
    modelId,
    initialValues,
    onSubmit,
    ...reactFinalFormProps
}: EditFormProps<TInitialValues>) {
    const section = useModelSectionHandleOrThrow()

    const defaultOnSubmit = useOnSubmitEdit({
        section,
        modelId: modelId,
    })

    const customAttributes = useCustomAttributesQuery()
    const initialValuesWithAttributes = useMemo(() => {
        if (!customAttributes.data) {
            return undefined
        }
        if (!initialValues?.attributeValues) {
            return initialValues
        }
        return {
            ...initialValues,
            attributeValues: getAllAttributeValues(
                initialValues.attributeValues,
                customAttributes.data
            ),
        }
    }, [customAttributes.data, initialValues])

    if (!initialValuesWithAttributes) {
        return <LoadingSpinner />
    }

    console.log({
        initialValues,
        initialValuesWithAttributes,
        customAttributes: customAttributes.data,
    })
    return (
        <ReactFinalForm<TInitialValues>
            {...reactFinalFormProps}
            onSubmit={onSubmit ?? defaultOnSubmit}
            initialValues={initialValuesWithAttributes}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>{children}</form>
            )}
        />
    )
}
