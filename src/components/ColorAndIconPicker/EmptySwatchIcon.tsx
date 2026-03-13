import React from 'react'

export function EmptySwatchIcon({
    className,
}: Readonly<{ className?: string }>) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M21 23V24H3V23H21ZM23 21V3C23 1.89543 22.1046 1 21 1H3C1.89543 1 1 1.89543 1 3V21C1 22.1046 1.89543 23 3 23V24C1.34315 24 0 22.6569 0 21V3C0 1.34315 1.34315 0 3 0H21C22.6569 0 24 1.34315 24 3V21C24 22.6569 22.6569 24 21 24V23C22.1046 23 23 22.1046 23 21Z"
                fill="inherit"
            />
            <path
                d="M23.3535 22.6465L22.6465 23.3535L0.646484 1.35352L1.35352 0.646484L23.3535 22.6465Z"
                fill="inherit"
            />
        </svg>
    )
}
