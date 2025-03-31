import { FORM_ERROR } from 'final-form'
import { ApiErrorReport, isApiErrorReport, parseErrorResponse } from '../errors'

export const createFormError = (
    error: unknown
): {
    [FORM_ERROR]: ApiErrorReport
} => {
    let resolvedError: ApiErrorReport
    if (isApiErrorReport(error)) {
        resolvedError = error
    } else {
        resolvedError = parseErrorResponse(error)
    }
    return { [FORM_ERROR]: resolvedError }
}
