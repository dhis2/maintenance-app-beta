import React, { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import { DefaultLazyLoad } from '../../components'

// React.lazy only works with default exports, so we import directly instead of from index.tsx
const AllOverview = lazy(() => import('./AllOverview'))
const DataElements = lazy(() => import('./DataElements'))

const OverviewWrapper = () => <Outlet />

const route = {
    path: '/overview',
    element: <DefaultLazyLoad element={<OverviewWrapper />} />,
    children: [
        {
            index: true,
            element: <AllOverview />,
        },
        {
            path: 'dataElements',
            element: <DataElements />,
        },
    ],
}

export { AllOverview, route }
