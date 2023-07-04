import { useMatches } from 'react-router-dom'
import { Section } from '../types'
import { MatchRouteHandle } from './../app/routes/types'

export const useSectionHandle = (): Section | undefined => {
    const matches = useMatches() as MatchRouteHandle[]
    const match = matches.find((routeMatch) => routeMatch.handle?.section)

    return match?.handle?.section
}
