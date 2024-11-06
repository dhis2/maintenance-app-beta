// type AllowAnyString
type FieldDescriptor = {
    label: string
}

type SectionDescriptor<TModel = unknown> = {
    label: string
    // keyof T | (string & {}) allows auto-completion for fields, while also allowing
    // any other string to be used as a key
    fields: Partial<Record<keyof TModel | (string & {}), FieldDescriptor>>
    // fields: Partial<Record<keyof T | string, FieldDescriptor>>
}

type FormDescriptor<TModel = unknown> = {
    name: string
    sections: Record<string, SectionDescriptor<TModel>>
}
