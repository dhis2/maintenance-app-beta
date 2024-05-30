import { ButtonProps } from '@dhis2/ui'
import cx from 'classnames'
import React, { AnchorHTMLAttributes } from 'react'
import { useLinkClickHandler, useHref, To } from 'react-router-dom'
import css from './LinkButton.module.css'

type UseLinkClickHandlerParameters = Parameters<typeof useLinkClickHandler>

type LinkClickHandlerOptions = UseLinkClickHandlerParameters[1]

type RelevantButtonProps = Pick<
    ButtonProps,
    | 'disabled'
    | 'className'
    | 'primary'
    | 'secondary'
    | 'small'
    | 'toggled'
    | 'large'
    | 'destructive'
>

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkClickHandlerOptions &
    RelevantButtonProps & { to?: To }

/* Wrapping button with anchor-tags are not valid, style anchor as a UI-button */

/**
 * To or href may be used to control the location. If "to" is present, the link will be handled by react-router.
 */

export const LinkButton = ({
    onClick,
    disabled,
    className,
    primary,
    secondary,
    small,
    toggled,
    large,
    destructive,
    replace,
    state,
    preventScrollReset,
    to,
    href,
    ...anchorProps
}: LinkButtonProps) => {
    const resolvedClassname = cx(css.linkButton, className, {
        [css.disabled]: disabled,
        [css.primary]: primary,
        [css.secondary]: secondary,
        [css.destructive]: destructive,
        [css.toggled]: toggled,
        [css.large]: large,
        [css.small]: small,
    })

    if (to) {
        // the reason for splitting this is into components is because we want to either use "to" or "href" to resolve the link,
        // and thus need to call useHref conditionally
        return (
            <ReactRouterLinkButton
                {...anchorProps}
                className={resolvedClassname}
                disabled={disabled}
                onClick={onClick}
                to={to}
                replace={replace}
                state={state}
                preventScrollReset={preventScrollReset}
            />
        )
    }

    return (
        <a
            {...anchorProps}
            className={resolvedClassname}
            href={href}
            onClick={onClick}
        />
    )
}

type ReactRouterLinkButtonProps = Omit<LinkButtonProps, 'href' | 'to'> & {
    to: To
}
const ReactRouterLinkButton = ({
    className,
    disabled,
    onClick,
    to,
    relative,
    replace,
    state,
    preventScrollReset,
    target,
    ...anchorProps
}: ReactRouterLinkButtonProps) => {
    const resolvedHref = useHref(to, { relative })
    const handleClickInternal = useLinkClickHandler(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        target,
    })
    const handleClick = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        if (disabled) {
            event.preventDefault()
            return
        }
        if (onClick) {
            onClick(event)
        }
        if (!event.defaultPrevented) {
            handleClickInternal(event)
        }
    }
    return (
        <a
            {...anchorProps}
            className={className}
            href={resolvedHref}
            onClick={handleClick}
            target={target}
        />
    )
}
