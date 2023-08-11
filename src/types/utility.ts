import * as Models from './generated/models'
import * as Utility from './generated/utility'
//export type * from './generated/utility'
import { Query as DataQuery } from './query'

type Resource = {
    dataElements: Models.DataElement
    categoryCombos: Models.CategoryCombo
}
type ParamFields = string[] | readonly string[]
type ResourceQuery = Omit<DataQuery[number], 'params'> & {
    params?: {
        fields?: ParamFields
    }
}
type Query = {
    [key: string]: ResourceQuery
}

type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never
type RemoveLast<T extends any[]> = T extends [...infer R, any] ? R : never
type RemoveSpaces<S extends string> = S extends `${infer T} ${infer U}`
    ? RemoveSpaces<`${T}${U}`>
    : S
/* 
  Helper Type to split a nested field string into components.
  NOTE: This only supports one level of nesting.
  However, this is a helper, and full recursion support of field-filters 
  is supported in cooperation with ModelFromFields below.
 Split<'categoryOptions,id,name,sharing[public,owner]', ','>
 becomes: ["categoryOptions", "id", "name", "sharing[public,owner]"]
*/
type RecursiveSplitFieldFilter<
    S extends string,
    D extends string = ','
> = string extends S
    ? string[]
    : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
    ? U extends `${infer RM}[${infer NM}]`
        ? // if last part (U) is a nested field eg. categoryCombo[id,name]
          // we dont want to split inside of brackets - because that would split the nested field
          // eg. "categoryOptions,id,name,sharing[public,owner]" would become ['categoryOptions', 'id', 'name','sharing[public', 'owner]']
          // so we first recurse without last part (sharing) and split the parts before the brackets.
          // then we need to add the last element (sharing) back before the brackets.
          // Since there's no way to "store" the result of the recursion, we need to do it twice
          [
              T,
              ...RemoveLast<RecursiveSplitFieldFilter<RM, D>>,
              `${Last<RecursiveSplitFieldFilter<RM, D>>}[${NM}]`
          ]
        : [T, ...RecursiveSplitFieldFilter<U, D>]
    : [S]

type SplitFieldFilter<
    S extends string,
    D extends string = ','
> = RecursiveSplitFieldFilter<RemoveSpaces<S>, D>

// helper to ensure that a key is a key of an object, if not return never
// mainly to prevent super deep ternaries
type EnsureKeyOf<Key extends string, Obj> = Key extends keyof Obj ? Key : never

// gets the model, if in an array, return the model in the array
type GetModel<T> = T extends Array<infer U> ? U : T

type MaybeCollection<Model, FullModel> = FullModel extends Array<infer U>
    ? Model[]
    : Model

type RecursiveModelFromFields<
    Model,
    Fields extends string = keyof Model & string // = [...keyof (T & string)]
> = {
    [Field in Fields as Field extends `${infer Nested}[${string}]` // Field field is nested
        ? EnsureKeyOf<Nested, Model> // ensure that Nested is a key of T, and return the key (eg. categoryCombo from categoryCombo[id,name])
        : EnsureKeyOf<
              Field,
              Model
          >]: Field extends `${infer Nested}[${infer Rest}]`
        ? Nested extends keyof Model // needed to do T[Nested] below
            ? // if its a valid nested field, recurse down the object
              // wrap in collection, if the original field was a collection
              MaybeCollection<
                  RecursiveModelFromFields<
                      GetModel<Model[Nested]>, // get the model from the array, if its an array
                      SplitFieldFilter<Rest, ','>[number] // split the rest of the field-filter into ['id', 'name']
                  >,
                  Model[Nested]
              >
            : unknown // if Nested is not keyOf model, return unknown
        : Field extends keyof Model
        ? Model[Field] // if its not a nested field, return the property as is
        : unknown // not a key of Model, return unknown
}

// Gets the union of query.params.fields
// note that this assumes all keys, in the case of no field-filter
///which would not match the api - which would have some defaults
type FieldsFromQuery<Q extends ResourceQuery> =
    Q['resource'] extends keyof Resource
        ? 'fields' extends keyof Q['params']
            ? Q['params']['fields'] extends ParamFields
                ? Q['params']['fields'][number]
                : keyof Resource[Q['resource']] & string // if fields are not an array, return all from Model
            : keyof Resource[Q['resource']] & string // if no fields, return all from Model
        : string

export type ModelFromResourceQuery<Q extends ResourceQuery> =
    Q['resource'] extends keyof Resource
        ? RecursiveModelFromFields<Resource[Q['resource']], FieldsFromQuery<Q>>
        : unknown

export type ModelsFromQuery<Q extends Query> = {
    [K in keyof Q]: Q[K]['resource'] extends keyof Resources
        ? ModelFromResourceQuery<Q[K]>
        : unknown
}
