import { FormState, FormSubscription } from 'final-form'
import { useFormState } from 'react-final-form'

const formStateSubscriptions = {
    errors: true,
    submitError: true,
    submitFailed: true,
    hasValidationErrors: true,
    hasSubmitErrors: true,
    dirtySinceLastSubmit: true,
} satisfies FormSubscription

type FinalFormErrorProps = Pick<
    FormState<unknown>,
    keyof typeof formStateSubscriptions
>

export type FormErrorState = Omit<FinalFormErrorProps, 'errors'> & {
    // helper to decide wheter a noticebox should be shown
    shouldShowErrors: boolean
    // we rename "errors" to "validationErrors" to make it more clear that it only contain validation errors
    validationErrors: Record<string, string> | undefined
}

export const useFormStateErrors = (): FormErrorState => {
    const {
        dirtySinceLastSubmit,
        errors,
        hasSubmitErrors,
        hasValidationErrors,
        submitError,
        submitFailed,
    }: FinalFormErrorProps = useFormState({
        subscription: formStateSubscriptions,
    })

    const hasAnyError = !!(hasSubmitErrors || hasValidationErrors)

    // should only show errors after trying to submit
    const shouldShowErrors =
        (hasAnyError && submitFailed && !dirtySinceLastSubmit) ||
        (submitFailed && hasSubmitErrors)
    return {
        dirtySinceLastSubmit,
        hasSubmitErrors,
        hasValidationErrors,
        shouldShowErrors,
        submitError,
        submitFailed,
        validationErrors: errors,
    }
}
