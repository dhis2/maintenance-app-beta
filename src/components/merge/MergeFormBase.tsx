import React from 'react'
import { Form } from 'react-final-form'
import { MergeFormValuesBase } from './mergeSchemaBase'

export type MergeFormBaseProps<TValues> = {
    initialValues: Partial<TValues>
    onSubmit: (
        values: TValues
    ) => Promise<Record<string, unknown | undefined> | undefined>
    validate: (values: TValues) => Record<string, string> | undefined
    children: React.ReactNode
}
export const MergeFormBase = <TValues extends MergeFormValuesBase>({
    initialValues,
    onSubmit,
    validate,
    children,
}: MergeFormBaseProps<TValues>) => {
    return (
        <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
            subscription={{
                values: false,
                submitting: true,
                submitSucceeded: true,
            }}
        >
            {({ handleSubmit }) => (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        padding: '16px',
                        backgroundColor: 'white',
                    }}
                >
                    {children}
                </form>
            )}
        </Form>
    )
}
