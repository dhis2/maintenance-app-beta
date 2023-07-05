import { useMatches } from 'react-router-dom'
import { SchemaSection, Section } from '../types'
import { MatchRouteHandle } from './../app/routes/types'

export const useSectionHandle = (): Section | undefined => {
    const matches = useMatches() as MatchRouteHandle[]
    const match = matches.find((routeMatch) => routeMatch.handle?.section)

    return match?.handle?.section
}

export const useSchemaSectionHandleOrThrow = (): SchemaSection => {
    const matches = useMatches() as MatchRouteHandle[]
    const match = matches.find((routeMatch) => routeMatch.handle?.section)

    const section = match?.handle?.section
    if (!section) {
        throw new Error('Could not find schema section handle')
    }
    return section
}
