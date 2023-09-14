//@ts-nocheck

import type { DataElement, IdentifiableObject } from '../../types/generated'

type Split<S extends string, D extends string = '.'> = string extends S
    ? string[]
    : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
    ? [T, ...Split<U, D>]
    : [S]

type SS = Split<'access'>

type PathsForModel<Model> = Values<{
    [key in keyof Model]: key extends string
        ? Model[key] extends object
            ? [key] | readonly [key, Flatten<PathsForModel<Model[key]>>]
            : key
        : never
}>

type Values<T> = T[keyof T]

type PFM = PathsForModel<DataElement>
type Acc = Extract<PFM, readonly ['access', any]>
type accz = Acc[1]
type Flatten<T> = T extends (infer U)[] ? (U extends any[] ? Flatten<U> : U) : T

type TypeForPath<Model, Paths extends string[]> = Paths extends [
    infer Head,
    ...infer Tail extends string[]
]
    ? Head extends keyof Model
        ? TypeForPath<Model[Head], Tail>
        : never
    : Model

type A = TypeForPath<DataElement, ['access', 'data']>

type IsPathFor<Path extends string, Model> = TypeForPath<
    Model,
    Split<Path>
> extends [never]
    ? never
    : string

type IPF = IsPathFor<'accesss.data', DataElement>

type AllPathsFor = {
    path: PathsForModel<DataElement>
}

type arr = []
const obj = {
    path: ['valueTypeOptions'],
} satisfies AllPathsFor
