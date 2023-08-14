import * as Models from './generated/models'
import * as Utility from './generated/utility'
//export type * from './generated/utility'
import { Query as DataQuery } from './query'

type Resources = {
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

// only used to be able to infer the Key to prevent having to write Q['resource']
type KeyofResources<R extends keyof Resources> = R

type ModelKeysForResource<R extends keyof Resources> = keyof Resources[R] &
    string

// https://github.com/microsoft/TypeScript/issues/23182#issuecomment-379091887
// for why we need [brackets] around types
type NeverToString<T> = [T] extends [never] ? string : T

// filter out invalid keys (eg. not known keys of the Model)
// If MapNestedToRoot is true, also convert nested fields to the root-key (eg. categoryCombo[id,name] becomes categoryCombo)
// This is used to check if the root keys are valid
// When false, nested fields are not converted, but they're checked if they're valid
// Thus, this type can be used both to get the valid root-keys (for checking if the root-keys are valid),
// and to get the filtered valid-fields, where we need to preserve the nested fields.
// GetValidFields<'categoryCombo[id,name]' | 'id', 'dataElements', true> becomes: 'categoryCombo' | 'id'
// GetValidFields<'categoryCombo[id,name]' | 'id', 'dataElements', false> becomes: 'categoryCombo[id,name]' | 'id'
type GetValidFields<
    Fields extends string,
    ResourceKey extends keyof Resources,
    MapNestedToRoot extends boolean = false // if true,
> = NeverToString<
    RemoveSpaces<
        keyof {
            [Field in Fields as Field extends `${infer Nested}[${infer _}]`
                ? Nested extends ModelKeysForResource<ResourceKey>
                    ? MapNestedToRoot extends true
                        ? Nested
                        : Field
                    : never
                : Field extends ModelKeysForResource<ResourceKey>
                ? Field
                : never]: Field
        }
    >
>

// helper to get original string[] from query.params.fields
type GetFieldsInQuery<Q extends ResourceQuery> =
    Q['resource'] extends KeyofResources<infer R>
        ? Q['params'] extends {
              fields: ParamFields
          }
            ? Q['params']['fields'] //GetValidFields<F, R>
            : never // string[]
        : never

// used to return partial model if fields cannot be inferred (eg. dynamic fields)
// GetFieldsInQuery will be never if no fields are specified, so we return full model if thats the case
type MaybePartial<T, Condition> = [Condition] extends [never] ? T : Partial<T>

export type ModelFromResourceQuery<Q extends ResourceQuery> =
    Q['resource'] extends KeyofResources<infer ResourceKey>
        ? GetValidFields<
              GetFieldsInQuery<Q>[number],
              ResourceKey,
              true
          > extends ModelKeysForResource<ResourceKey> // fields are valid and can be inferred, filter with those keys
            ? RecursiveModelFromFields<
                  Resources[ResourceKey],
                  GetValidFields<GetFieldsInQuery<Q>[number], ResourceKey>
              >
            : // if fields cannot be inferred, return partial model with all fields
              // if fields does not exist in query, return Full model as is
              MaybePartial<
                  RecursiveModelFromFields<
                      Resources[ResourceKey],
                      ModelKeysForResource<ResourceKey>
                  >,
                  GetFieldsInQuery<Q>
              >
        : unknown // not a valid resource - return unknown

export type ModelsFromQuery<Q extends Query> = {
    [K in keyof Q]: Q[K]['resource'] extends keyof Resources
        ? ModelFromResourceQuery<Q[K]>
        : unknown
}

const dynamicFields = ['id', 'name']
const resourceQuery = {
    resource: 'dataElements',
    params: {
        fields: [
            'id',
            'name',
            'categoryCombo[id,attributeValues[attribute[attributeValues[attribute]]]]',
        ],
        // fields: dynamicFields,
        //   fields: ['id', 'birk', 'categoryCombo[id,name]'],
    },
} as const

type RQ = ModelFromResourceQuery<typeof resourceQuery>
const m = {} as RQ
//rq.categoryCombo.attributeValues.map(av => av.attribute.attributeValues.map(av => av.) )
