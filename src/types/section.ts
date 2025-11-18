import type { OverviewSectionName, SchemaFieldProperty } from '../lib'
import { Access } from './generated'
import { SchemaAuthorities, SchemaName } from './schemaBase'

export interface SectionBase {
    name: string
    namePlural: string
    titlePlural: string
    title: string
    routeName?: string
    minApiVersion?: number
    maxApiVersion?: number
    fieldGenerator?: (name: string) => SchemaFieldProperty
    accessGenerator?: () => Access
}

// SchemaSection is a section that can be mapped directly to a schema by the name

export type SchemaSection = SectionBase & {
    name: SchemaName
    parentSectionKey: OverviewSectionName
}

export type NonSchemaSection = SectionBase & {
    authorities: SchemaAuthorities
    parentSectionKey: OverviewSectionName
}

export type OverviewSection = SectionBase & {
    componentName: string
}

export type ModelSection = SchemaSection | NonSchemaSection
export type Section = SchemaSection | NonSchemaSection | OverviewSection

export type SchemaSectionMap = {
    [key in SchemaName]?: SchemaSection
}

export type OverviewSectionMap = Record<string, OverviewSection>

export type SectionMap = Record<string, ModelSection>
