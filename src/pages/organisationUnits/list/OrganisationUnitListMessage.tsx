import { UseQueryResult } from 'react-query'
import {
    SectionListEmpty,
    SectionListError,
} from '../../../components/sectionList/SectionListMessages'
import React from 'react'
import { SectionListLoader } from '../../../components/sectionList/SectionListLoader'

type OrganisationUnitListMessageProps = {
    orgUnitCount: number
    isFiltering: boolean
    queries: UseQueryResult[]
}

export const OrganisationUnitListMessage = ({
    orgUnitCount,
    isFiltering,
    queries,
}: OrganisationUnitListMessageProps) => {
    const firstError = queries.find((query) => query.error)

    if (firstError) {
        console.error(firstError.error)
        return <SectionListError />
        return <p>Failed to load organisation units</p>
    }

    // we only show loading indicator when we don't have any data to show
    // and some query is loading
    const anyFirstLoading =
        orgUnitCount < 1 && queries.some((query) => query.isLoading)

    if (anyFirstLoading) {
        return <SectionListLoader />
    }

    if (orgUnitCount < 1) {
        return <SectionListEmpty />
    }
    return null
}
