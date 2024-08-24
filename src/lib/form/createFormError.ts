import { FORM_ERROR } from 'final-form'

export const createFormError = (error: unknown) => {
    let errorMessage
    if (error instanceof Error || typeof error === 'string') {
        errorMessage = error.toString()
    } else {
        errorMessage = 'An unknown error occurred'
    }
    return { [FORM_ERROR]: errorMessage }
}
