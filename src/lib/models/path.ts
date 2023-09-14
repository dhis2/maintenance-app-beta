export const stringToPathArray = (str: string): string[] => str.split('.')

const resolvePath = (path: string | string[]): string[] => {
    return typeof path === 'string' ? stringToPathArray(path) : path
}

export const getIn = (object: any, path: string | string[]) => {
    const pathArray = resolvePath(path)

    let current = object
    for (const prop of pathArray) {
        if (current == null || current[prop] == null) {
            return undefined
        }
        current = current[prop]
    }
    return current
}

export const getFieldFilterFromPath = (path: string | string[]): string => {
    const pathParts = resolvePath(path)
    if (pathParts.length === 1) {
        return pathParts[0]
    }

    const [currentPart, ...rest] = pathParts
    const nestedFilter = getFieldFilterFromPath(rest)

    return `${currentPart}[${nestedFilter}]`
}
