import cx from 'classnames'
import { FocusTrap } from 'focus-trap-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DRAWER_PORTAL_ID, type DrawerLevel } from '../../lib/constants'
import { useSystemSettingsStore } from '../../lib/systemSettings'
import css from './Drawer.module.css'
import { DrawerHeader } from './DrawerHeader'

export interface DrawerProps {
    isOpen: boolean
    children: React.ReactNode
    onClose: () => void
    level?: DrawerLevel
    header?: React.ReactNode
    footer?: React.ReactNode
}
export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    children,
    onClose,
    level = 'primary',
    header,
    footer,
}) => {
    const globalShellEnabled =
        useSystemSettingsStore(
            (state) => state.systemSettings?.globalShellEnabled
        ) ?? false

    const handleOverlayClick = () => {
        onClose()
    }

    const handleDrawerClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div
            className={cx(css.drawerOverlay, {
                [css.open]: isOpen,
                [css.legacyShell]: !globalShellEnabled,
            })}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isOpen}
        >
            <div
                className={cx(css.drawer, {
                    [css.open]: isOpen,
                    [css.drawerPrimary]: level === 'primary',
                    [css.drawerSecondary]: level === 'secondary',
                })}
                onClick={handleDrawerClick}
            >
                {isOpen && (
                    <DrawerContents
                        onClose={onClose}
                        header={header}
                        footer={footer}
                    >
                        {children}
                    </DrawerContents>
                )}
            </div>
        </div>
    )
}

interface DrawerContentsProps {
    children: React.ReactNode
    onClose: () => void
    header?: React.ReactNode
    footer?: React.ReactNode
}

const DrawerContents = React.forwardRef<HTMLDivElement, DrawerContentsProps>(
    function DrawerContents({ children, onClose, header, footer }, ref) {
        useEffect(() => {
            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose()
                }
            }
            document.addEventListener('keydown', onKeyDown)
            return () => document.removeEventListener('keydown', onKeyDown)
        }, [onClose])

        return (
            <FocusTrap
                focusTrapOptions={{
                    delayInitialFocus: true,
                    allowOutsideClick: true,
                }}
            >
                <div ref={ref} className={css.drawerContents}>
                    <span tabIndex={0} aria-hidden="true" />
                    {header && (
                        <DrawerHeader onClose={onClose}>{header}</DrawerHeader>
                    )}
                    <div className={css.drawerBody}>{children}</div>
                    {footer && <div className={css.drawerFooter}>{footer}</div>}
                </div>
            </FocusTrap>
        )
    }
)

export const DrawerRoot: React.FC = () => {
    return <div id={DRAWER_PORTAL_ID} className={css.drawerRoot} />
}

export const DrawerPortal: React.FC<DrawerProps> = (drawerProps) => {
    const [mountNode, setMountNode] = useState<HTMLElement | null>(() =>
        document.getElementById(DRAWER_PORTAL_ID)
    )

    useEffect(() => {
        const portalRoot = document.getElementById(DRAWER_PORTAL_ID)
        if (portalRoot) {
            setMountNode(portalRoot)
        } else {
            console.error(
                `Drawer portal root with ID #${DRAWER_PORTAL_ID} not found. ` +
                    'Make sure <DrawerRoot /> is rendered in your app root.'
            )
        }
    }, [])

    if (!mountNode) {
        return null
    }

    return createPortal(<Drawer {...drawerProps} />, mountNode)
}
