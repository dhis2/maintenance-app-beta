import { IconChevronDown16 } from '@dhis2/ui-icons'
import cx from 'classnames'
import React, { PropsWithChildren } from 'react'
import styles from './Sidenav.module.css'

export const Sidenav = ({ children }: PropsWithChildren) => (
    <nav className={styles['sidenav-wrap']}>{children}</nav>
)

export const SidenavItems = ({ children }: PropsWithChildren) => (
    <ul className={styles['sidenav-items']}>{children}</ul>
)

export const SidenavHeader = ({ children }: PropsWithChildren) => (
    <div className={styles['sidenav-header']}>{children}</div>
)

export const SidenavFooter = ({ children }: PropsWithChildren) => (
    <div className={styles['sidenav-footer']}>{children}</div>
)

interface SidenavParentProps {
    label: string
    icon?: React.ReactNode
    disabled?: boolean
    open: boolean
    onClick?: () => void
}

export const SidenavParent = ({
    label,
    icon,
    disabled,
    children,
    open,
    onClick,
}: PropsWithChildren<SidenavParentProps>) => {
    return (
        <>
            <li
                className={cx(styles['sidenav-parent'], {
                    [styles['sidenav-parent-has-icon']]: icon,
                    [styles['parent-is-open']]: open,
                })}
            >
                <button onClick={onClick} disabled={disabled}>
                    {icon && (
                        <span className={styles['sidenav-item-icon']}>
                            {icon}
                        </span>
                    )}
                    <span className={styles['sidenav-parent-label']}>
                        {label}
                    </span>
                    <span className={styles['sidenav-parent-chevron']}>
                        <IconChevronDown16 />
                    </span>
                </button>
                {open && (
                    <ul className={styles['sidenav-submenu']}>{children}</ul>
                )}
            </li>
        </>
    )
}

export interface Path {
    /**
     * A URL pathname, beginning with a /.
     */
    pathname: string

    /**
     * A URL search string, beginning with a ?.
     */
    search: string

    /**
     * A URL fragment identifier, beginning with a #.
     */
    hash: string
}

interface SidenavLinkComponentProps {
    to: string | Partial<Path>
    // rest props
    [key: string]: unknown
}

interface SidenavLinkProps {
    icon?: React.ReactNode
    active?: boolean
    disabled?: boolean
    children?: React.ReactNode
    to: string | Partial<Path>
    label?: React.ReactNode
    end?: boolean
    LinkComponent?: React.ComponentType<SidenavLinkComponentProps>
}

interface SidenavLinkBaseProps {
    disabled?: boolean
}

export const SidenavLinkBase = ({
    children,
    disabled,
}: PropsWithChildren<SidenavLinkBaseProps>) => (
    <li
        className={cx(styles['sidenav-link'], {
            [styles['sidenav-link-disabled']]: disabled,
        })}
    >
        {children}
    </li>
)

/**
 * If children is a string, it will be rendered as a link.
 * if not it's up to the rendered child to render an "a"-tag for proper styling
 * This is to provide flexibility to render a link using NavLink or Link from react-router
 */
export const SidenavLink = ({
    icon,
    active,
    disabled,
    children,
    to,
    LinkComponent,
    label,
    end,
}: SidenavLinkProps) => {
    const linkElement = LinkComponent ? (
        <LinkComponent to={to} end={end}>
            {icon && (
                <span className={styles['sidenav-item-icon']}>{icon}</span>
            )}
            {label}
        </LinkComponent>
    ) : (
        <a
            href={to as string}
            className={cx({
                [styles['active']]: active,
            })}
        >
            {icon && (
                <span className={styles['sidenav-item-icon']}>{icon}</span>
            )}
            {label}
        </a>
    )

    return (
        <SidenavLinkBase disabled={disabled}>
            {React.Children.count(children) > 0 ? children : linkElement}
        </SidenavLinkBase>
    )
}

export const SidenavDivider = () => <li className="sidenav-divider"></li>

interface SidenavSectionTitleProps {
    label: string
}

export const SidenavSectionTitle = ({ label }: SidenavSectionTitleProps) => (
    <li className="sidenav-section-title">{label}</li>
)
