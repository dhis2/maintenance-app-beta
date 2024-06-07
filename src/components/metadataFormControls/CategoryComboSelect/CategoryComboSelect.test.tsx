/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { ComponentWithProvider } from '../../../testUtils/TestComponentWithRouter'
import { CategoryComboSelect } from './CategoryComboSelect'

const categoryCombos = [
    {
        displayName: 'Births',
        id: 'm2jTvAj5kkm',
    },
    {
        displayName: 'Commodities',
        id: 'gbvX3pogf7p',
    },
    {
        displayName: 'Fixed/Outreach',
        id: 'KYYSTxeVw28',
    },
    {
        displayName: 'Gender',
        id: 'dPmavA0qloX',
    },
    {
        displayName: 'HIV age',
        id: 'Wfan7UwK8CQ',
    },
    {
        displayName: 'HIV age+gender',
        id: 'jCNGsC2NawV',
    },
    {
        displayName: 'HIV Paed age+gender',
        id: 'v1K6CE6bmtw',
    },
    {
        displayName: 'Implementing Partner',
        id: 'nM3u9s5a52V',
    },
    {
        displayName: 'Implementing Partner and Projects',
        id: 'O4VaNks6tta',
    },
    {
        displayName: 'Location and age group',
        id: 'dzjKKQq0cSO',
    },
    {
        displayName: 'Maternal deaths',
        id: 'sgoeVsAbF4r',
    },
    {
        displayName: 'Morbidity Age',
        id: 'pbvcDRasDav',
    },
    {
        displayName: 'Morbidity Cases',
        id: 't3aNCvHsoSn',
    },
    {
        displayName: 'Morbidity Referrals',
        id: 'ck7mRNwGDjP',
    },
    {
        displayName: 'Pregnancy complications',
        id: 'Hz71pt7Eb3e',
    },
    {
        displayName: 'Project',
        id: 'idcDPkDtepR',
    },
    {
        displayName: 'Rural and Urban',
        id: 'DJXmyhnquyI',
    },
    {
        displayName: 'Staffing',
        id: 'aN8uN5b15YG',
    },
    {
        displayName: 'Stock discarded',
        id: 'WA3HunbaGt0',
    },
    {
        displayName: 'Target vs Result',
        id: 'WBW7RjsApsv',
    },
    {
        displayName: 'TT',
        id: 'arTwh07V6qz',
    },
    {
        displayName: 'Under 5/5 and above',
        id: 'UnNIOt1uB0J',
    },
]

const categoryCombosResolver = (...args: any[]) => {
    const [, query] = args
    const { id } = query

    if (query?.variables?.id) {
        const categoryCombo = categoryCombos.find((cc) => id === cc.id)
        return Promise.resolve(categoryCombo)
    }

    return Promise.resolve({
        categoryCombos,
        pager: {
            page: 1,
            total: 23,
            pageSize: 50,
            pageCount: 1,
        },
    })
}

// Exporting this so other tests which render this component
// don't have to mock this, too
export const dataResolvers = {
    categoryCombos: categoryCombosResolver,
}

describe('<CategoryComboSelect />', () => {
    it('should render all options and None (default catCombo)', async () => {
        const onChange = jest.fn()
        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <CategoryComboSelect onChange={onChange} />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        for (let i = 0; i < categoryCombos.length; ++i) {
            const categoryCombo = categoryCombos[i]
            const selectOptions = await result.findByText(
                categoryCombo.displayName,
                { selector: '[data-test="dhis2-uicore-singleselectoption"]' }
            )
            expect(selectOptions).toBeTruthy()
        }
        const noneOption = await result.findByText('None', {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })
        expect(noneOption).toBeInTheDocument()
    })

    it('should add an "empty" option when not required', async () => {
        const onChange = jest.fn()
        const dataResolvers = {
            categoryCombos: categoryCombosResolver,
        }

        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <CategoryComboSelect onChange={onChange} />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        const noneLabel = await result.findByText('None', {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })
        const selectedLabel = await result.findByText(/No value/, {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })

        expect(noneLabel).toBeInTheDocument()
        expect(selectedLabel).toBeInTheDocument()
        // We'd find a single option if we didn't wait for this. The test would
        // subsequently fail as there'd be exactly one categoryCombo option
        await waitFor(() => {
            const allOptions = result.getAllByTestId(
                'dhis2-uicore-singleselectoption'
            )

            expect(allOptions).toHaveLength(categoryCombos.length + 2)
        })
    })

    it('should not add an "empty" option when not required', async () => {
        const onChange = jest.fn()
        const dataResolvers = {
            categoryCombos: categoryCombosResolver,
        }

        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <CategoryComboSelect required onChange={onChange} />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        // We'd find a single option if we didn't wait for this. The test would
        // subsequently fail as there'd be exactly one categoryCombo option
        await waitFor(() => {
            const allOptions = result.getAllByTestId(
                'dhis2-uicore-singleselectoption'
            )

            expect(allOptions).toHaveLength(categoryCombos.length + 1)
        })
    })

    it('should load the initially selected option', async () => {
        const onChange = jest.fn()
        const dataResolvers = {
            categoryCombos: categoryCombosResolver,
        }

        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <CategoryComboSelect
                    selected="m2jTvAj5kkm"
                    onChange={onChange}
                />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        const selectedLabel = await result.findByText('Births', {
            selector: '.root',
        })
        expect(selectedLabel).toBeTruthy()
    })

    it('should call the onChange handler with the newly selected value', async () => {
        const onChange = jest.fn()
        const dataResolvers = {
            categoryCombos: categoryCombosResolver,
        }

        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <CategoryComboSelect onChange={onChange} />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        const selectedLabel = await result.findByText('Births', {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })
        fireEvent.click(selectedLabel)

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith({ selected: 'm2jTvAj5kkm' })
    })
})
