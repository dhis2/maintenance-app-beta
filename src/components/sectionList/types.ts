export type SelectedColumn = string

export type SelectedColumns = ReadonlyArray<SelectedColumn>

export type CheckBoxOnChangeObject = {
    checked: boolean
    name?: string
    value?: string
}
