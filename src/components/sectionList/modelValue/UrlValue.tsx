import React from 'react'

export const UrlValue = ({ value }: { value?: string }) => (
    <a
        href={value}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
    >
        {value}
    </a>
)
