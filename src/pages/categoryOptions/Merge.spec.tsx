import { render } from '@testing-library/react'
import React from 'react'
import { SECTIONS_MAP } from '../../lib'
import { testCategoryOption } from '../../testUtils/builders'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { generateDefaultMergeTests } from '../defaultMergeTests'
import { Component as Merge } from './Merge'

const renderMerge = async () => {
    const routeOptions = {
        handle: { section: SECTIONS_MAP.categoryOption },
    }

    return render(
        <TestComponentWithRouter
            path="/categoryOptions/merge"
            customData={{
                categoryOptions: [
                    testCategoryOption(),
                    testCategoryOption(),
                    testCategoryOption(),
                ],
            }}
            routeOptions={routeOptions}
        >
            <Merge />
        </TestComponentWithRouter>
    )
}
generateDefaultMergeTests({ componentName: 'Category option', renderMerge })
