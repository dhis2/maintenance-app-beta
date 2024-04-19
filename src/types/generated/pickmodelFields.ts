import { List, String } from 'ts-toolbelt'
import { DataElement } from './models'
type RemoveLast<T extends any[]> = T extends [...infer R, any] ? R : never
type RecursiveSplitFieldFilter<
    S extends string,
    D extends string = ','
> = string extends S
    ? string[]
    : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
    ? U extends `${infer UHead}[${infer NestedFields}]`
        ? // if last part (U) is a nested field eg. categoryCombo[id,name]
          // we dont want to split inside of brackets - because that would split the nested field
          // eg. "categoryOptions,id,name,sharing[public,owner]" would become ['categoryOptions', 'id', 'name','sharing[public', 'owner]']
          // so we first recurse without last part (sharing) and split the parts before the brackets.
          // then we need to add the last element (sharing) back before the brackets.
          // Since there's no way to "store" the result of the recursion, we need to do it twice
          //   [T, ...RecursiveSplitFieldFilter<U>]
          [
              T,
              ...List.Take<RecursiveSplitFieldFilter<UHead, D>, 1>,
              `${List.Last<
                  RecursiveSplitFieldFilter<UHead, D>
              >}[${NestedFields}]`
          ]
        : //   [
          //       T,
          //       ...(RecursiveSplitFieldFilter<UHead, D> extends [ // Extends here is used to "store" the result of the recursion
          //           ...infer Head extends any[],
          //           infer NestedRoot extends string // NestedRoot is eg. sharing in id,name,sharing[id]
          //       ]
          //           ? [...Head, `${NestedRoot}[${NestedFields}]`]
          //           : never),
          //         //   ...RecursiveSplitFieldFilter<Rest>
          //   ]
          // [T, `${RootModel}[${NestedFields}]`]
          [T, ...RecursiveSplitFieldFilter<U, D>]
    : [S]
type FieldF = 'id,name,attribute[value],categoryCombo[id,name]'
type RC = RecursiveSplitFieldFilter<'id,name,categoryCombo[id,name],test[id]'>
type RCSplit = String.Split<
    'id,name,categoryCombo[id,name, dataElement[id, name]]',
    ','
>
type Split = RecursiveSplitFieldFilter<FieldF>

type BeforeBrack = List.Select<RCSplit, `${string}[${string}`, 'contains->'>
type Selected = List.Select<RCSplit, `${string}]`, 'contains->'>
type Zipped = List.Zip<Selected, [']']>
type RCReplaced = String.Replace<'id,name,categoryCombo[id,name]', ',', ''>
type RC2 = String.Split<
    String.Replace<'id,name,categoryCombo[id,name]', ',', '~'>,
    '~'
>

// helper to ensure that a key is a key of an object, if not return never
// mainly to prevent super deep ternaries
type EnsureKeyOf<Key extends string, Obj> = Key extends keyof Obj ? Key : never

// gets the model, if in an array, return the model in the array
type GetModel<T> = T extends Array<infer U> ? U : T

type MaybeCollection<Model, FullModel> = FullModel extends Array<infer U>
    ? Model[]
    : Model

type PickIdentifiableFields<TModel> = Pick<
    TModel,
    ('id' | 'code' | 'name' | 'created' | 'lastUpdated' | 'lastUpdatedBy') &
        keyof TModel
>

type FilterPresetsMap<
    TModel extends IdentifiableObject,
    S extends string = 'id'
> = {
    '*': PickInModelReferences<TModel, 'id'>
    ':identifiable': PickIdentifiableFields<TModel>
}

type TD = FilterPresetsMap<DataElement>[':identifiable'] &
    FilterPresetsMap<DataElement>['*']
const t = {} as TD

// type EnsureValidField<TKey extends string, TModel> = EnsureKeyOf<TKey, TModel> extends
// type GetShortcutFields<T>
export type PickModelFields<
    Model,
    Fields extends string // = keyof Model & string // = [...keyof (T & string)]
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
                  PickModelFields<
                      GetModel<Model[Nested]>, // get the model from the array, if its an array
                      RecursiveSplitFieldFilter<Rest>[number] // split the rest of the field-filter into ['id', 'name']
                  >,
                  Model[Nested]
              >
            : unknown // if Nested is not keyOf model, return unknown
        : Field extends keyof Model
        ? Model[Field] // if its not a nested field, return the property as is
        : unknown // not a key of Model, return unknown
}
type Picked = PickModelFields<DataElement, 'id,name,categoryCombo[id,name]'>
