import { render } from '@testing-library/react'
import React from 'react'
import { SECTIONS_MAP } from '../../lib'
import { testIndicatorType } from '../../testUtils/builders'
import TestComponentWithRouter from '../../testUtils/TestComponentWithRouter'
import { generateDefaultMergeTests } from '../defaultMergeTests'
import { Component as Merge } from './Merge'

const renderMerge = async () => {
    const routeOptions = {
        handle: { section: SECTIONS_MAP.indicatorType },
    }

    return render(
        <TestComponentWithRouter
            path="/indicators/merge"
            customData={{
                indicatorTypes: [testIndicatorType(), testIndicatorType()],
            }}
            routeOptions={routeOptions}
        >
            <Merge />
        </TestComponentWithRouter>
    )
}
generateDefaultMergeTests({ componentName: 'Indicator type', renderMerge })

describe('Indicator type additional tests', () => {
    it('should show a warning if target and source have different factors', () => {})
})
