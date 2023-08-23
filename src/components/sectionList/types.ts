export type SelectedColumn<Model = unknown> = {
    label: string
    modelPropertyName: keyof Model & string
}

export type SelectedColumns<Model = unknown> = Array<SelectedColumn<Model>>

export type CheckBoxOnChangeObject = {
    checked: boolean
    name?: string
    value?: string
}
