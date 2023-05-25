import { IdentifiableObject } from './models/IdentifiableObject'

type ModelReferenceCollection = Array<IdentifiableObject>
type ModelReference = IdentifiableObject | ModelReferenceCollection

type BaseGist<T> = {
    apiEndpoints: GistApiEndpoints<T>
}
type GistApiEndpoints<T> = {
    // filter keys that are references
    [P in keyof T as T[P] extends ModelReference ? P : never]: string
}
/**
 * A utility type that takes a Model (eg. DataElement)
 * and returns the gist-api representation of that model
 */
export type GistModel<T> = BaseGist<T> & {
    [P in keyof T]: T[P] extends ModelReference
        ? T[P] extends ModelReferenceCollection
            ? number // map array-references to number (gist shows total in collection)
            : string // map references to a string (gist shows id)
        : T[P]
}

// utility type can be used like this:
// type DataElementGist = GistModel<
//     Pick<DataElement, "id" | "code" | "categoryCombo" | "legendSets">
// >;
