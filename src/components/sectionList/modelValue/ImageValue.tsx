import React from 'react'

interface ImageValueProps {
    value: string
}

export const ImageValue: React.FC<ImageValueProps> = ({ value }) => {
    const isDhis2Icon = value.includes('/api/icons/')
    const title =
        value.split('/').slice(-2, -1)[0]?.replace(/_/g, ' ') ?? 'icon'

    if (!isDhis2Icon) {
        return null
    }

    return (
        <img
            src={value}
            alt="icon"
            title={title}
            width={25}
            height={25}
            onError={(e) => {
                e.currentTarget.style.display = 'none'
            }}
        />
    )
}
