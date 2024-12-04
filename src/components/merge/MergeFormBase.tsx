import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Card, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { Form } from 'react-final-form'
import { DefaultFormErrorNotice } from '../form/DefaultFormErrorNotice'
import { LinkButton } from '../LinkButton'
import { LoadingSpinner } from '../loading/LoadingSpinner'
import { MergeFormValuesBase } from './mergeSchemaBase'

export type MergeFormBaseProps<TValues> = {
    initialValues: Partial<TValues>
    onSubmit: (values: TValues) => Promise<Record<string, unknown>>
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
            {({ handleSubmit, submitSucceeded, submitting }) => (
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
                    {submitting && (
                        <span>
                            <CircularLoader small />
                            Merging...
                        </span>
                    )}
                    {!submitting && !submitSucceeded && (
                        <>
                            {children}
                            <DefaultFormErrorNotice />
                            <ButtonStrip>
                                <Button primary type="submit">
                                    {i18n.t('Merge')}
                                </Button>
                                <Button secondary>{i18n.t('Cancel')}</Button>
                            </ButtonStrip>
                        </>
                    )}
                    {submitSucceeded && (
                        <div>
                            <h2>Merge complete</h2>
                            <LinkButton to="../">
                                {i18n.t('Back to list')}
                            </LinkButton>
                        </div>
                    )}
                </form>
            )}
        </Form>
    )
}
