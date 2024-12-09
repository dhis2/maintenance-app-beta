import cx from 'classnames'
import React from 'react'
import { Form } from 'react-final-form'
import css from './MergeForm.module.css'
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
                <StyledMergeForm onSubmit={handleSubmit}>
                    {children}
                </StyledMergeForm>
            )}
        </Form>
    )
}

export const StyledMergeForm = ({
    children,
    ...formProps
}: React.PropsWithChildren<React.ComponentProps<'form'>>) => (
    <form className={cx(css.mergeForm, formProps.className)} {...formProps}>
        {children}
    </form>
)
