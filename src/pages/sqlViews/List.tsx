import React from 'react'
import { DefaultSectionList } from '../DefaultSectionList'
import {
    SqlViewListActions,
    SqlViewResultsDrawerProvider,
} from './SqlViewListActions'

export const Component = () => (
    <SqlViewResultsDrawerProvider>
        <DefaultSectionList ActionsComponent={SqlViewListActions} />
    </SqlViewResultsDrawerProvider>
)
