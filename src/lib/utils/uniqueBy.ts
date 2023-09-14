export const uniqueBy = <T, K>(
    array: ReadonlyArray<T>,
    transformer: (item: T) => K
): T[] => {
    const set = new Set<K>()

    const uniqueArr: T[] = []
    for (const item of array) {
        const key = transformer(item)
        if (!set.has(key)) {
            set.add(key)
            uniqueArr.push(item)
        }
    }
    return uniqueArr
}
