import {
    RenderResult,
    act,
    fireEvent,
    render,
    waitFor,
} from '@testing-library/react'
import React from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import dataElementSchemaMock from '../../__mocks__/schema/dataElementsSchema.json'
import { useSchemaStore } from '../../lib/schemas/schemaStore'
import { ModelSchemas } from '../../lib/useLoadApp'
import { ComponentWithProvider } from '../../testUtils/TestComponentWithRouter'
import attributes from './__mocks__/attributes.json'
import categoryCombosPage1 from './__mocks__/categoryCombosPage1.json'
import { Component as New } from './New'

// @TODO: For some reason string interpolation somewhere within the Transfer
//        component does not get transpiled correctly for the cjs build when
//        building the UI library. We'll have to address that at some point.
//        See: https://dhis2.atlassian.net/browse/LIBS-537
jest.mock('@dhis2/ui', () => {
    const ui = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...ui,
        Transfer: () => <div />,
    }
})

async function changeSingleSelect(
    result: RenderResult,
    selectLabelText: string,
    text: string
) {
    const selectLabel = await result.findByText(selectLabelText)
    const field = selectLabel.parentNode?.parentNode as HTMLElement
    expect(field).toBeTruthy()

    const trigger = field.querySelector(
        '[data-test="dhis2-uicore-select-input"].root'
    ) as HTMLElement
    expect(trigger).toBeTruthy()
    fireEvent.click(trigger)

    await result.findByTestId('dhis2-uicore-layer')
    const optionElement = await result.findByText(text, {
        selector: '[data-value]',
    })

    fireEvent.click(optionElement)
}

describe('Data Elements / New', () => {
    jest.spyOn(console, 'warn').mockImplementation((value) => {
        if (!value.match(/The query should be static/)) {
            console.warn(value)
        }
    })

    useSchemaStore.getState().setSchemas({
        dataElement: dataElementSchemaMock,
    } as unknown as ModelSchemas)

    const customData = {
        attributes: attributes,
        categoryCombos: categoryCombosPage1,
    }

    it('should return to the list view when cancelling', async () => {
        const List: React.FC = jest.fn(() => <div />)
        const router = createMemoryRouter(
            [
                { path: '/new', element: <New /> },
                { path: '/dataElements', element: <List /> },
            ],
            { initialEntries: ['/new'] }
        )

        const result = render(
            <ComponentWithProvider dataForCustomProvider={customData}>
                <RouterProvider router={router} />
            </ComponentWithProvider>
        )

        const cancelButton = await result.findByText('Exit without saving', {
            selector: 'button',
        })

        expect(List).toHaveBeenCalledTimes(0)

        fireEvent.click(cancelButton)

        expect(List).toHaveBeenCalledTimes(1)
    })

    it('should not submit when required values are missing', async () => {
        const router = createMemoryRouter([{ path: '/', element: <New /> }])
        const result = render(
            <ComponentWithProvider dataForCustomProvider={customData}>
                <RouterProvider router={router} />
            </ComponentWithProvider>
        )

        const submitButton = await result.findByText('Create data element', {
            selector: 'button',
        })

        fireEvent.click(submitButton as HTMLButtonElement)

        expect(
            result.container.querySelectorAll('.error[data-test*="validation"]')
                .length
        ).toBe(4)

        expect(
            result.container.querySelector(
                '[data-test="dataelementsformfields-name"] .error'
            )
        ).toBeTruthy()

        expect(
            result.container.querySelector(
                '[data-test="dataelementsformfields-shortname"] .error'
            )
        ).toBeTruthy()

        expect(
            result.container.querySelector(
                '[data-test="dataelementsformfields-valuetype"] .error'
            )
        ).toBeTruthy()

        expect(
            result.container.querySelector(
                '[data-test="dataelementsformfields-aggregationtype"] .error'
            )
        ).toBeTruthy()
    })

    it('should submit the data and return to the list view on success', async () => {
        const List: React.FC = jest.fn(() => <div />)
        const dataElementCustomData = jest.fn(() => Promise.resolve({}))
        const router = createMemoryRouter(
            [
                { path: '/new', element: <New /> },
                { path: '/dataElements', element: <List /> },
            ],
            {
                initialIndex: 0,
                initialEntries: ['/new'],
            }
        )
        const result = render(
            <>
                <div id="dhis2-portal-root" />
                <ComponentWithProvider
                    dataForCustomProvider={{
                        ...customData,
                        dataElements: dataElementCustomData,
                    }}
                >
                    <RouterProvider router={router} />
                </ComponentWithProvider>
            </>
        )

        const submitButton = await result.findByText('Create data element', {
            selector: 'button',
        })

        expect(submitButton).toBeTruthy()

        fireEvent.change(
            result.getByLabelText('Name (required)*') as HTMLElement,
            { target: { value: 'Data element name' } }
        )

        fireEvent.change(
            result.getByLabelText('Short name (required)*') as HTMLElement,
            { target: { value: 'Data element short name' } }
        )

        await act(async () => {
            await changeSingleSelect(result, 'Value type (required)', 'Text')
        })

        await act(async () => {
            await changeSingleSelect(
                result,
                'Aggregation type (required)',
                'Sum'
            )
        })

        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(List).toHaveBeenCalledTimes(1)
        })
    })
})
