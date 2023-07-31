import { useSchemaSectionHandleOrThrow } from '../routeUtils'
import { useSchema } from './schemaStore'

export const useSchemaFromHandle = () => {
    const section = useSchemaSectionHandleOrThrow()
    const schema = useSchema(section.name)
    return schema
}
