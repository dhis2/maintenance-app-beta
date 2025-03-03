export type SelectedColumn = {
    label: string
    path: string
    disableSorting?: boolean
}

export type SelectedColumns = ReadonlyArray<SelectedColumn>

export type CheckBoxOnChangeObject = {
    checked: boolean
    name?: string
    value?: string
}
