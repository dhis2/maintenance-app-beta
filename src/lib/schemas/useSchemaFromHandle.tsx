import {
    type SchemaSection,
    type NonSchemaSection,
    type SchemaName,
    type SchemaFieldProperty,
} from '../../types'
import {
    DEFAULT_ACCESS,
    DEFAULT_FIELD_GENERATOR,
    isNonSchemaSection,
} from '../constants'
import { useSectionHandle } from '../routeUtils'
import { getColumnsForSection } from '../sectionList/listViews/viewConfigResolver'
import { useSchema } from './schemaStore'

export const useSchemaFromHandle = () => {
    const section = useSectionHandle()
    if (!section) {
        throw new Error('No section found for current route')
    }

    if (isNonSchemaSection(section)) {
        const nonSchemaSection = section
        const columns = getColumnsForSection(nonSchemaSection.name).available

        const fieldGenerator =
            nonSchemaSection?.fieldGenerator ?? DEFAULT_FIELD_GENERATOR
        const accessGenerator =
            nonSchemaSection?.accessGenerator ?? DEFAULT_ACCESS

        const properties: Record<string, SchemaFieldProperty> = columns.reduce(
            (acc, col) => {
                acc[col.path] = fieldGenerator(col.path)
                return acc
            },
            {} as Record<string, SchemaFieldProperty>
        )

        return {
            name: nonSchemaSection.name as SchemaName,
            plural:
                nonSchemaSection.namePlural === 'locales'
                    ? 'locales/dbLocales'
                    : (nonSchemaSection.namePlural as SchemaName),
            singular: nonSchemaSection.name as SchemaName,
            displayName: nonSchemaSection.title,
            translatable: false,
            authorities: nonSchemaSection.authorities,
            shareable: true,
            dataShareable: true,
            properties,
            access: accessGenerator(),
        }
    }
    const schemaSection = section as SchemaSection
    return useSchema(schemaSection.name)
}


