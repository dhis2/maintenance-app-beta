export const parseNumericInput = (rawValue?: string) => {
    if (rawValue === undefined || rawValue === '') {
        return undefined
    }

    const numericValue = Number(rawValue)
    return Number.isFinite(numericValue) ? numericValue : undefined
}

export const formatNumericInput = (numericValue?: number) => {
    if (numericValue === undefined || !Number.isFinite(numericValue)) {
        return ''
    }

    return numericValue.toString()
}
