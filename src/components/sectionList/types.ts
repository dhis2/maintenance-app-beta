import { IdentifiableObject } from '../../types/generated'

export type SelectedColumn<Model extends IdentifiableObject> = {
    label: string
    modelPropertyName: keyof Model
}

export type SelectedColumns<Model extends IdentifiableObject> =
    SelectedColumn<Model>[]
