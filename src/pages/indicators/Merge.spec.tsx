import { render } from '@testing-library/react'
import React from 'react'
import { SECTIONS_MAP } from '../../lib'
import { testIndicator } from '../../testUtils/builders'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { generateDefaultMergeTests } from '../defaultMergeTests'
import { Component as Merge } from './Merge'

const renderMerge = async () => {
    const routeOptions = {
        handle: { section: SECTIONS_MAP.indicator },
    }

    return render(
        <TestComponentWithRouter
            path="/indicators/merge"
            customData={{
                indicators: [testIndicator(), testIndicator()],
            }}
            routeOptions={routeOptions}
        >
            <Merge />
        </TestComponentWithRouter>
    )
}

generateDefaultMergeTests({ componentName: 'Indicator', renderMerge })
