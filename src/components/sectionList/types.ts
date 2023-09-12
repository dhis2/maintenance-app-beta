import { IdentifiableObject } from '../../types/generated'

export type SelectedColumn = {
    label: string
    path: string
}

export type SelectedColumns = SelectedColumn[]

export type CheckBoxOnChangeObject = {
    checked: boolean
    name?: string
    value?: string
}
