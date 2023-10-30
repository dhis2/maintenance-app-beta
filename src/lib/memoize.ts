/* eslint-disable @typescript-eslint/no-explicit-any */

const doArgsMatch = (prev: any[], next: any[]) => {
    if (!prev && !next) {
        return true
    }

    if (prev?.length !== next?.length) {
        return false
    }

    return prev.every((value, index) => value === next[index])
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function memoize(fn: Function) {
    let called = false
    let args: any
    let value: any

    return (...nextArgs: any[]) => {
        const argsMatch = called && doArgsMatch(args, nextArgs)
        called = true

        if (argsMatch) {
            return value
        }

        args = nextArgs
        value = fn(...nextArgs)
        return value
    }
}
