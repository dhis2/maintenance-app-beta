// @TODO: Figure out if there's a utility for this? I couldn't find one
export function segmentsToPath(segments: Array<string | number>) {
    return segments.reduce((path, segment) => {
        return typeof segment === 'number'
            ? `${path}[${segment}]`
            : `${path}.${segment}`
    }) as string
}
