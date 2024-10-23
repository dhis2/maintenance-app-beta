import React from 'react'
import { Link, useMatches } from 'react-router-dom'
import {
    Section,
    isOverviewSection,
    getSectionPath,
    getOverviewPath,
    useToWithSearchState,
} from '../../lib'
import type { MatchRouteHandle } from '../routes/types'
import css from './Breadcrumb.module.css'

const BreadcrumbSeparator = () => <span className={css.separator}>/</span>

type BreadcrumbItemProps = {
    section: Section
    label?: string
}

export const BreadcrumbItem = ({ section, label }: BreadcrumbItemProps) => {
    const isOverview = isOverviewSection(section)
    const link = isOverview ? getOverviewPath(section) : getSectionPath(section)
    const to = useToWithSearchState(`/${link}`)

    label = label ?? isOverview ? section.titlePlural : section.title

    return (
        <Link className={css.breadcrumbItem} to={to}>
            {label}
        </Link>
    )
}

export const Breadcrumbs = () => {
    const matches = useMatches() as MatchRouteHandle[]

    const crumbs = matches
        .filter((match) => match.handle?.crumb)
        .map((match) => (
            <span key={match.id}>
                {match.handle?.crumb?.()}
                <BreadcrumbSeparator />
            </span>
        ))

    return <div className={css.breadcrumbWrapper}>{crumbs}</div>
}
