import type { BaseIdentifiableObject } from './models'
import { Prettify } from './utility'

type RemoveSpaces<S extends string> = S extends `${infer T} ${infer U}`
    ? RemoveSpaces<`${T}${U}`>
    : S

// utility type to convert a union to an intersection
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
    x: infer I
) => void
    ? I
    : never

// utility type to get the base type of a model, so get an object we can pick from
//  if in an array, return the model in the array
//  remove undefined and null modifiers, because we cannot pick if those are present
type GetModel<T> = NonNullable<T extends Array<infer U> ? U : T>

// we cannot pick within collections, so we keep the original model if it is an array
// then we wrap in this helper to get the array-type back
// use extract to keep modifiers like undefined | null
type MaybeCollection<Model, FullModel> = FullModel extends Array<infer U>
    ? Model[] | Extract<FullModel, undefined | null>
    : Model | Extract<FullModel, undefined | null>

type RecursivePickWithFieldFilter<
    Model,
    S extends string,
    D extends string = ','
> = string extends S
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      Model // if we cant infer the actual value of the string, return full model
    : S extends ''
    ? never
    : S extends `${infer Root extends string & keyof Model}[${infer Nested}]` // we have a nested filter eg. user[access]
    ? {
          // create an object with root key, and recursively pick the nested fields
          [K in Root]: MaybeCollection<
              Prettify<
                  RecursivePickWithFieldFilter<GetModel<Model[Root]>, Nested>
              >,
              Model[Root]
          >
      }
    : S extends `${infer T extends string & keyof Model}${D}${infer U}` // simple filter eg. id,name
    ? Pick<Model, T> & RecursivePickWithFieldFilter<Model, U>
    : S extends keyof Model
    ? Pick<Model, S>
    : S extends ':owner'
    ? BaseIdentifiableObject
    : never //[Model, S] // not a key of Model, ignore

/**
 * From Model, Pick properties (and nested properties) using a field filter-array.
 * Field-filters are of the type ['name', 'id', 'access[read,delete]' and can be as deep as needed, to pick the nested fields.
 *
 * @example
 * type DataElementWithCategoryCombo = PickWithFieldFilters<DataElement, ['id', 'name', 'categoryCombo[id,displayName,categories[id,displayName]]']>
 * const de = {} as DataElementWithCategoryCombo
 * de.categoryCombo.categories.map(c => c.displayName)
 **/

export type PickWithFieldFilters<
    TModel,
    TFieldFilters extends readonly string[]
> =
    // RecursivePick<TModel, TFieldFilters[number]> will return an union of objects for each entry in fieldFilter-array.
    // Thus we convert this to an intersection to get one object with all the picked properties.
    Prettify<
        UnionToIntersection<
            RecursivePickWithFieldFilter<
                TModel,
                RemoveSpaces<TFieldFilters[number]>
            >
        >
    >
