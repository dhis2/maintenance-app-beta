export const stringToPathArray = (str: string): string[] => str.split('.')

const resolvePath = (path: string | string[]): string[] => {
    return typeof path === 'string'
        ? stringToPathArray(path)
        : path.filter((p) => !!p) // filter out empty strings
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Transforms a path like dataElement.id into a field filter of the form `dataElement[id]`
 * @param path the path to transform, a dot-delimited string or an array of strings
 * @param maxDepth the maximum number of nested fields to allow. If the path is deeper than this, the parts after the depth will be dropped.
 * Set this to 0 to create field-filters without the nested parts. Can be useful if the API does not support nested field-filters
 * for a particular request.
 * @returns
 */
export const getFieldFilterFromPath = (
    path: string | string[],
    maxDepth = 10
): string => {
    const recur = (path: string[], depth: number): string => {
        const pathParts = resolvePath(path)

        if (pathParts.length === 0) {
            return ''
        }
        if (pathParts.length === 1) {
            return pathParts[0]
        }

        const [currentPart, ...rest] = pathParts

        if (depth >= maxDepth) {
            return currentPart
        }

        const nestedFilter = recur(rest, depth + 1)

        return `${currentPart}[${nestedFilter}]`
    }

    return recur(resolvePath(path), 0)
}
