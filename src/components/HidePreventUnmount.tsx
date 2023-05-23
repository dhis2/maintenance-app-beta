import React from 'react'

/**
 * A simple utility component that can be wrapped around a component to prevent it from unmounting when hidden.
 * This is useful when you want to keep the state of a component when it is hidden.
 */
export const HidePreventUnmount = ({
    hide,
    children,
}: {
    hide: boolean
    children: React.ReactNode
}) => <div style={{ display: hide ? 'none' : 'initial' }}>{children}</div>
