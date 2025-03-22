import { FetchError } from '@dhis2/app-runtime'

export const isFetchError = (error: unknown): error is FetchError => {
    return error instanceof FetchError
}

export type ModuleNotFoundError = Error & {
    code: 'MODULE_NOT_FOUND'
}

export const isModuleNotFoundError = (
    error: unknown
): error is ModuleNotFoundError => {
    // vite will throw this error when failing to find a module with dynamic variables
    if (
        (error as Error)?.message.startsWith('Unknown variable dynamic import')
    ) {
        return true
    }
    // webpack will throw an error with code
    return (error as ModuleNotFoundError)?.code === 'MODULE_NOT_FOUND'
}
