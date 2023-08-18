export type SelectedColumn = {
    label: string
    modelPropertyName: string
}

export type SelectedColumns = SelectedColumn[]

export type CheckBoxOnChangeObject = {
    checked: boolean
    name?: string
    value?: string
}
