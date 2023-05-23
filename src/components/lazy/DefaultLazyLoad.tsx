import { CircularLoader } from '@dhis2/ui'
import React, { Suspense } from 'react'
import styles from './DefaultLazyLoad.module.css'

type DefaultLazyLoadProps = {
    element: React.ReactNode
}
export const DefaultLazyLoad: React.FC<DefaultLazyLoadProps> = ({
    element,
}) => (
    <Suspense fallback={<CircularLoader className={styles.loadingSpinner} />}>
        {element}
    </Suspense>
)
