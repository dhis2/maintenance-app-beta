import type { SchemaName } from './schemaBase'

export type Section = {
    name: SchemaName | string
    namePlural: string
    titlePlural: string
    title: string
    parentSectionKey: string
}
export type SectionMap = {
    [key: string]: Section
}
