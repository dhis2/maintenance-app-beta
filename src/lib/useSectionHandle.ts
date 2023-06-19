import { useMatches } from 'react-router-dom'
import { isSchemaSection } from '../constants'
import { SchemaSection, Section } from '../types'
import { MatchRouteHandle } from './../app/routes/types'

export const useSectionHandle = (): Section | undefined => {
    const matches = useMatches() as MatchRouteHandle[]
    const match = matches.find((matches) => matches.handle?.section)

    return match?.handle?.section
}

export const useSectionHandleOrThrow = (): Section => {
    const section = useSectionHandle()
    if (!section) {
        throw new Error('No section handle found')
    }
    return section
}

export const useSchemaSectionHandleOrThrow = (): SchemaSection => {
    const section = useSectionHandle()
    if (!section || !isSchemaSection(section)) {
        throw new Error('No schema section handle found')
    }
    return section
}
