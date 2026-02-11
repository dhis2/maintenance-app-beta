import cx from 'classnames'
import { FocusTrap } from 'focus-trap-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import css from './Drawer.module.css'
interface DrawerProps {
    isOpen: boolean
    children: React.ReactNode
    onClose: () => void
    level?: 'primary' | 'secondary'
}

const DRAWER_PORTAL_ID = 'drawer-portal'

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    children,
    onClose,
    level = 'primary',
}) => {
    return (
        <div
            className={cx(css.drawerOverlay, { [css.open]: isOpen })}
            onClick={onClose}
        >
            <div
                className={cx(css.drawer, {
                    [css.open]: isOpen,
                    [css.drawerPrimary]: level === 'primary',
                    [css.drawerSecondary]: level === 'secondary',
                })}
                onClick={(e) => e.stopPropagation()}
            >
                {isOpen && (
                    <DrawerContents onClose={onClose}>
                        {children}
                    </DrawerContents>
                )}
            </div>
        </div>
    )
}

const DrawerContents = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; onClose: () => void }
>(function DrawerContents({ children, onClose }, ref) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])
    return (
        <FocusTrap
            focusTrapOptions={{
                delayInitialFocus: true,
                allowOutsideClick: true,
                clickOutsideDeactivates: (event) => {
                    const target = event.target
                    if (!(target instanceof Element)) {
                        // If the event target is not an Element, treat it as an outside click
                        return true
                    }
                    const isInModal = target.closest('[role="dialog"]')
                    return !isInModal
                },
                returnFocusOnDeactivate: false,
                fallbackFocus: () => document.body,
            }}
        >
            <div ref={ref}>
                {/* Span with tabIndex to trap focus in case contents in drawer is loading,
            which would make the focustrap throw */}
                <span tabIndex={0}></span>
                {children}
            </div>
        </FocusTrap>
    )
})

export const DrawerRoot = () => {
    return <div id={DRAWER_PORTAL_ID} className={css.drawerRoot} />
}

export const DrawerPortal = ({ ...drawerProps }: DrawerProps) => {
    const [mountNode, setMountNode] = useState<HTMLElement | null>(() =>
        document.getElementById(DRAWER_PORTAL_ID)
    )

    useEffect(() => {
        // Find the portal root element after the initial render
        const portalRoot = document.getElementById(DRAWER_PORTAL_ID)
        if (portalRoot) {
            setMountNode(portalRoot)
        } else {
            console.error(
                `Drawer portal root with ID #${DRAWER_PORTAL_ID} not found.`
            )
        }
    }, [])

    if (!mountNode) {
        return null
    }

    return createPortal(<Drawer {...drawerProps} />, mountNode)
}
