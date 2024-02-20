import { ButtonProps } from '@dhis2/ui'
import cx from 'classnames'
import React, { AnchorHTMLAttributes } from 'react'
import { useLinkClickHandler, useHref } from 'react-router-dom'
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
    RelevantButtonProps & {
        to: Parameters<typeof useLinkClickHandler>[0]
    }

/* Wrapping button with anchor-tags are not valid, style anchor as a UI-button */
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
    target,
    replace,
    state,
    preventScrollReset,
    relative,
    to,
    href,
    ...anchorProps
}: LinkButtonProps) => {
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
        if (onClick) {
            onClick(event)
        }
        if (!event.defaultPrevented) {
            handleClickInternal(event)
        }
    }

    const resolvedClassname = cx(css.linkButton, className, {
        [css.disabled]: disabled,
        [css.primary]: primary,
        [css.secondary]: secondary,
        [css.destructive]: destructive,
        [css.toggled]: toggled,
        [css.large]: large,
        [css.small]: small,
    })
    return (
        <a
            {...anchorProps}
            className={resolvedClassname}
            href={href || resolvedHref}
            onClick={href ? onClick : handleClick}
            target={target}
        />
    )
}
