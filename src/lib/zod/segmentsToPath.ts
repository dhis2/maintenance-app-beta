// @TODO: Figure out if there's a utility for this? I couldn't find one
export function segmentsToPath(segments: Array<string | number>) {
    return segments.reduce((path, segment) => {
        if (segment === 'number') {
            return `${path}[${segment}]`
        }
        // if field is a reference, we want the error on the name of the field, and not nested
        if (segment === 'id') {
            return path
        }
        return `${path}.${segment}`
    }) as string
}
