export type ModuleNotFoundError = Error & {
    code: 'MODULE_NOT_FOUND'
}

export const isModuleNotFoundError = (
    error: unknown
): error is ModuleNotFoundError => {
    return (error as ModuleNotFoundError)?.code === 'MODULE_NOT_FOUND'
}
