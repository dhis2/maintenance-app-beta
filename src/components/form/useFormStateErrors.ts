import { FormState, FormSubscription } from 'final-form'
import { useFormState } from 'react-final-form'
import { ApiErrorReport, ensureApiErrorReport } from '../../lib'

const formStateSubscriptions = {
    errors: true,
    submitError: true,
    submitFailed: true,
    hasValidationErrors: true,
    hasSubmitErrors: true,
    dirtySinceLastSubmit: true,
    modifiedSinceLastSubmit: true,
} satisfies FormSubscription

type FinalFormErrorProps = Pick<
    FormState<unknown>,
    keyof typeof formStateSubscriptions
>

export type FormErrorState = Omit<
    FinalFormErrorProps,
    'errors' | 'submitError'
> & {
    // helper to decide wheter a noticebox should be shown
    shouldShowErrors: boolean
    // we rename "errors" to "validationErrors" to make it more clear that it only contain validation errors
    validationErrors: Record<string, string> | undefined
    submitError: ApiErrorReport | undefined
}

export const useFormStateErrors = (): FormErrorState => {
    const {
        dirtySinceLastSubmit,
        errors,
        hasSubmitErrors,
        hasValidationErrors,
        submitError,
        submitFailed,
        modifiedSinceLastSubmit,
    }: FinalFormErrorProps = useFormState({
        subscription: formStateSubscriptions,
    })

    const hasAnyError = !!(hasSubmitErrors || hasValidationErrors)

    // should only show errors after trying to submit
    const shouldShowErrors =
        (hasAnyError && submitFailed && !dirtySinceLastSubmit) ||
        (submitFailed && hasSubmitErrors)

    // since the error object can be anything, we need to ensure it is an ApiErrorReport
    const apiError = ensureApiErrorReport(submitError)
    return {
        dirtySinceLastSubmit,
        hasSubmitErrors,
        hasValidationErrors,
        shouldShowErrors,
        submitError: apiError,
        submitFailed,
        validationErrors: errors,
        modifiedSinceLastSubmit,
    }
}
