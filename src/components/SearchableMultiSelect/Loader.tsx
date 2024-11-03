import { CircularLoader } from '@dhis2/ui'
import * as React from 'react'
import { forwardRef } from 'react'

export const Loader = forwardRef<HTMLDivElement, object>(function Loader(
    _,
    ref
) {
    return (
        <div
            ref={ref}
            style={{
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20,
                overflow: 'hidden',
            }}
        >
            <CircularLoader />
        </div>
    )
})
