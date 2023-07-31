// @dhis2/ui is not typed, so we need to create our own types for it.

export type CheckBoxOnChangeObject = {
    checked: boolean
    name?: string
    value?: string
}

export type InputOnChangeObject = {
    value: string
    name: string | undefined
}

export type InputOnChange = (
    value: InputOnChangeObject,
    event: React.ChangeEvent<HTMLInputElement>
) => void

export type SelectOnChangeObject = {
    selected: string | undefined
}
export type SelectOnChange = (value: SelectOnChangeObject) => void
