export type * from './generated/utility'

export type KeysOfValue<T, TCondition> = keyof {
    [K in keyof T as T[K] extends TCondition ? K : never]: K
}

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

export type RemoveIndexSignature<T> = {
    [K in keyof T as string extends K ? never : K]: T[K]
}
