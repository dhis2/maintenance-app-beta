import { useSchema, useSchemaSectionHandleOrThrow } from '../'

export const useSchemaFromHandle = () => {
    const section = useSchemaSectionHandleOrThrow()
    const schema = useSchema(section.name)
    return schema
}
