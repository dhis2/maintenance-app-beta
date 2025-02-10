import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { ComponentWithProvider } from '../../../testUtils/TestComponentWithRouter'
import { PlainResourceQuery } from '../../../types'
import { ModelSingleSelect } from './ModelSingleSelect'

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

const categoryCombosResolver = (type: string, query: PlainResourceQuery) => {
    const { id } = query
    if (id) {
        const categoryCombo = categoryCombos.find((cc) => id === cc.id)
        return Promise.resolve(categoryCombo)
    }

    const page = query.params?.page || 1
    const pageSize = query.params?.pageSize || 10
    const pagedCategoryCombos = categoryCombos.slice(
        (page - 1) * pageSize,
        page * pageSize
    )

    return Promise.resolve({
        categoryCombos: pagedCategoryCombos,
        pager: {
            page,
            total: categoryCombos.length,
            pageSize: pageSize,
            pageCount: Math.ceil(categoryCombos.length / pageSize),
        },
    })
}

// Exporting this so other tests which render this component
// don't have to mock this, too
export const dataResolvers = {
    categoryCombos: categoryCombosResolver,
}

describe('<CategoryComboSelect />', () => {
    const categoryComboQuery = {
        resource: 'categoryCombos',
    }

    it('should render all options', async () => {
        const onChange = jest.fn()
        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <ModelSingleSelect
                    onChange={onChange}
                    query={categoryComboQuery}
                />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        for (let i = 0; i < 5; ++i) {
            const categoryCombo = categoryCombos[i]
            const selectOptions = await result.findByText(
                categoryCombo.displayName,
                { selector: '[data-test="dhis2-uicore-singleselectoption"]' }
            )
            expect(selectOptions).toBeTruthy()
        }
    })

    it('should add an "empty" option when showNoValueOption is true', async () => {
        const onChange = jest.fn()
        const dataResolvers = {
            categoryCombos: categoryCombosResolver,
        }

        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <ModelSingleSelect
                    onChange={onChange}
                    query={{ resource: 'categoryCombos' }}
                    showNoValueOption
                    selected={categoryCombos[0]}
                />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        await waitFor(() => {
            const allOptions = result.getAllByTestId(
                'dhis2-uicore-singleselectoption'
            )
            expect(allOptions[0]).toHaveTextContent('No value')
        })

        const noValueOption = await result.findByText(/No value/, {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })
        fireEvent.click(noValueOption)

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledTimes(1)
            expect(onChange).toHaveBeenCalledWith(undefined)
        })
    })

    it('should display the selected option, even when not loaded', async () => {
        const onChange = jest.fn()
        const dataResolvers = {
            categoryCombos: categoryCombosResolver,
        }
        const selectedNotInData = {
            id: 't3aNClHsoSn',
            displayName: 'Quizzes attended+age',
        }

        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <ModelSingleSelect
                    onChange={onChange}
                    query={categoryComboQuery}
                    selected={selectedNotInData}
                />
            </ComponentWithProvider>
        )

        const selectedLabel = await result.findByText(
            selectedNotInData.displayName,
            {
                selector: '.root',
            }
        )
        expect(selectedLabel).toBeTruthy()
    })

    it('should load the displayName if selected does not include it and not in already loaded options', async () => {
        const onChange = jest.fn()
        const dataResolvers = {
            categoryCombos: categoryCombosResolver,
        }
        // get a catcombo not in the first page...
        const catCombo = categoryCombos[11]
        const catComboWithoutDisplayName = {
            id: catCombo.id,
        }

        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolvers}>
                <ModelSingleSelect
                    onChange={onChange}
                    query={categoryComboQuery}
                    selected={catComboWithoutDisplayName}
                />
            </ComponentWithProvider>
        )

        await waitFor(() => {
            // should call onChange when it resolves the displayName
            expect(onChange).toHaveBeenCalledTimes(1)
            expect(onChange).toHaveBeenCalledWith({
                id: catCombo.id,
                displayName: catCombo.displayName,
            })
        })
        // const selectInput = result.getByTestId('dhis2-uicore-select-input')
        // fireEvent.click(selectInput)

        const selectedLabel = await result.findByText(catCombo.displayName, {
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
                <ModelSingleSelect
                    onChange={onChange}
                    query={categoryComboQuery}
                />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        const selectedLabel = await result.findByText('Births', {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })
        fireEvent.click(selectedLabel)

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith({
            id: 'm2jTvAj5kkm',
            displayName: 'Births',
        })
    })

    it('should pass the entire loaded model as parameter in onChange', async () => {
        const onChange = jest.fn()
        const dataResolver = {
            categoryCombos: async () => {
                return Promise.resolve({
                    categoryCombos: categoryCombos.map((c) => ({
                        ...c,
                        dataDimensionType: 'DISAGGREGATION',
                    })),
                    pager: {
                        page: 1,
                        total: 23,
                        pageSize: 50,
                        pageCount: 1,
                    },
                })
            },
        }
        const categoryComboQueryWithDimensionType = {
            resource: 'categoryCombos',
            params: {
                fields: ['id', 'displayName', 'dataDimensionType'],
            },
        }

        const result = render(
            <ComponentWithProvider dataForCustomProvider={dataResolver}>
                <ModelSingleSelect
                    onChange={onChange}
                    query={categoryComboQueryWithDimensionType}
                />
            </ComponentWithProvider>
        )

        const selectInput = result.getByTestId('dhis2-uicore-select-input')
        fireEvent.click(selectInput)

        const selectedLabel = await result.findByText('Births', {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })
        fireEvent.click(selectedLabel)

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith({
            id: 'm2jTvAj5kkm',
            displayName: 'Births',
            dataDimensionType: 'DISAGGREGATION',
        })
    })
})
