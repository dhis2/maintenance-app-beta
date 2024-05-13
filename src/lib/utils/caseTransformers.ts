export const constantCaseToCamelCase = (str: string) => {
    return str
        .toLowerCase()
        .replace(/_([a-z])/g, (match) => match[1].toUpperCase())
}

export const camelCaseToConstantCase = (str: string) => {
    return str.replace(/([A-Z])/g, (match) => `_${match}`).toUpperCase()
}
