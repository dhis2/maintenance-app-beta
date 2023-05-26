import { SchemaName } from './schemaBase'

export interface Section {
    name: string
    namePlural: string
    titlePlural: string
    title: string
    parentSectionKey: string
}

// SchemaSection is a section that can be mapped directly to a schema by the name
export interface SchemaSection extends Section {
    name: SchemaName
}

export type SectionMap = {
    [key: string]: Section | SchemaSection
}

export const isSchemaSection = (section: Section): section is SchemaSection =>
    section.name in SchemaName
