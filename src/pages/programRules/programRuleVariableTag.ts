const TAGGED_NAME_PATTERN = /^#\{(.+)\}$/

export const toTaggedName = (name: string) => `#{${name}}`

export const fromTaggedName = (value: string) =>
    TAGGED_NAME_PATTERN.exec(value)?.[1] ?? value
