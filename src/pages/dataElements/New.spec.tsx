import { RenderResult, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import dataElementSchemaMock from '../../__mocks__/schema/dataElementsSchema.json'
import { useSchemaStore } from '../../lib/schemas/schemaStore'
import { ModelSchemas } from '../../lib/useLoadApp'
import { ComponentWithProvider } from '../../testUtils/TestComponentWithRouter'
import { generateDefaultAddFormTests } from '../defaultFormTests'
import attributes from './__mocks__/attributes.json'
import categoryCombosPage1 from './__mocks__/categoryCombosPage1.json'
import { Component as New } from './New'

jest.mock('../../lib/routeUtils/useSectionHandle', () => ({
    useSchemaSectionHandleOrThrow: jest.fn(() => ({
        name: 'dataElement',
        namePlural: 'dataElements',
        parentSectionKey: 'dataElement',
        title: 'Data element',
        titlePlural: 'Data elements',
    })),
}))

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

generateDefaultAddFormTests({ componentName: 'Data element group set' })

describe('Data Elements / New', () => {
    const consoleWarn = console.warn
    jest.spyOn(console, 'warn').mockImplementation((value) => {
        if (!value.match(/The query should be static/)) {
            consoleWarn(value)
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
        const router = createMemoryRouter(
            [
                { path: '/dataElements/new', element: <New /> },
                { path: '/dataElements', element: <div>List view</div> },
            ],
            { initialEntries: ['/dataElements/new'] }
        )

        const result = render(
            <ComponentWithProvider dataForCustomProvider={customData}>
                <RouterProvider router={router} />
            </ComponentWithProvider>
        )

        const cancelButton = await result.findByText('Exit without saving', {
            selector: 'a',
        })

        expect(result.queryByText('List view')).toBeNull()

        fireEvent.click(cancelButton)

        const listView = await result.findByText('List view')
        expect(listView).toBeTruthy()
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

        const nameRequiredError = await result.findByText('Required', {
            selector: '[data-test="formfields-name-validation"]',
        })
        expect(nameRequiredError).toBeTruthy()

        const shortNameRequiredError = await result.findByText('Required', {
            selector: '[data-test="formfields-shortname-validation"]',
        })
        expect(shortNameRequiredError).toBeTruthy()

        expect(
            result.container.querySelectorAll(
                '.error[data-test$="-validation"]'
            )
        ).toHaveLength(2)
    })

    it('should submit the data and return to the list view on success', async () => {
        const dataElementCustomData = () =>
            Promise.resolve({
                pager: { total: 0 },
            })
        const router = createMemoryRouter(
            [
                { path: '/dataElements/new', element: <New /> },
                { path: '/dataElements', element: <div>List view</div> },
            ],
            {
                initialIndex: 0,
                initialEntries: ['/dataElements/new'],
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

        const nameInput = result.getByRole('textbox', {
            name: 'Name (required) *',
        }) as HTMLInputElement
        fireEvent.change(nameInput, {
            target: { value: 'Data element name' },
        })
        fireEvent.blur(nameInput)

        const shortNameInput = result.getByRole('textbox', {
            name: 'Short name (required) *',
        }) as HTMLInputElement
        fireEvent.change(shortNameInput, {
            target: { value: 'Data element short name' },
        })
        fireEvent.blur(shortNameInput)

        await changeSingleSelect(
            result,
            'Category combination (required)',
            'None'
        )
        fireEvent.click(submitButton)

        const listView = await result.findByText('List view')
        expect(listView).toBeTruthy()
    })

    it('contain all needed field', () => {})
    it('should show an error if name field is too long', () => {})
    it('should show an error if short name field is too long', () => {})
    it('should show an error if code field is too long', () => {})
    it('should show an error if description field is too long', () => {})
    it('should show an error if name field is a duplicate', () => {})
    it('should show an error if short name field is a duplicate', () => {})
    it('should show an error if code field is a duplicate', () => {})
})
