import { IdentifiableObject } from '../../types/generated'

export type SelectedColumn<Model extends IdentifiableObject> = {
    label: string
    modelPropertyName: keyof Model & string
}

export type SelectedColumns<
    Model extends IdentifiableObject = IdentifiableObject
> = SelectedColumn<Model>[]

export type CheckBoxOnChangeObject = {
    checked: boolean
    name?: string
    value?: string
}
