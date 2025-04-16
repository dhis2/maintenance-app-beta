import { IconChevronDown24 } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { HidePreventUnmount } from '../HidePreventUnmount'
import css from './CollapsibleCard.module.css'

export type CollapsibleCardProps = {
    initiallyExpanded?: boolean
    unMount?: boolean
    headerElement?: React.ReactNode
}
export const CollapsibleCard = ({
    children,
    initiallyExpanded,
    headerElement,
    unMount = true,
}: React.PropsWithChildren<CollapsibleCardProps>) => {
    const [isExpanded, setIsExpanded] = React.useState(
        initiallyExpanded ?? true
    )
    return (
        <div className={css.collapsibleCard}>
            <div className={css.headerWrapper}>
                <button
                    className={cx(css.transparentButton, {
                        [css.expanded]: isExpanded,
                    })}
                    type={'button'}
                    onClick={() => setIsExpanded((prev) => !prev)}
                >
                    <IconChevronDown24 color="var(--colors-grey600)" />
                </button>
                {headerElement}
            </div>
            {unMount && isExpanded && children}
            {!unMount && (
                <HidePreventUnmount hide={isExpanded}>
                    {children}
                </HidePreventUnmount>
            )}
        </div>
    )
}

export const CollapsibleCardTitle = ({
    prefix,
    title,
}: {
    prefix?: string
    title: string
}) => {
    return (
        <span className={css.titleWrapper}>
            {prefix && <h3 className={css.prefix}>{prefix} </h3>}
            <h3>{title}</h3>
        </span>
    )
}
export const CollapsibleCardHeader = ({
    children,
}: React.PropsWithChildren) => {
    return <div className={css.header}>{children}</div>
}
