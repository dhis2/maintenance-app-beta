import { render, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { Form } from 'react-final-form'
import { VALUE_TYPE, useSchemas, useOptionSetQuery } from '../../../lib'
import { ValueTypeField } from './ValueTypeField'
import resetAllMocks = jest.resetAllMocks

jest.mock('../../../lib/optionSet/useOptionSetQuery', () => ({
    useOptionSetQuery: jest.fn(),
}))

jest.mock('../../../lib/schemas/schemaStore', () => {
    return {
        ...jest.requireActual('../../../lib/schemas/schemaStore'),
        useSchemas: jest.fn(),
    }
})

const valueTypes = Object.keys(VALUE_TYPE)

describe('<ValueTypeField />', () => {
    // `(useOptionSetQuery as jest.Mock).mockImplementation` causes the code to be
    // built wrongly and subsequently to bug out
    const uOSQ = useOptionSetQuery as jest.Mock
    const uS = useSchemas as jest.Mock

    uS.mockImplementation(() => ({
        dataElement: {
            properties: {
                valueType: { constants: valueTypes },
            },
        },
    }))

    it('should not have the MULTI_TEXT option when a different value is selected', async () => {
        uOSQ.mockImplementation(() => ({
            called: false,
            loading: false,
            fetching: false,
            error: null,
            data: null,
            refetch: jest.fn(),
        }))

        const initialValues = {
            valueType: '',
            optionSet: [],
        }

        const result = render(
            <Form onSubmit={jest.fn()} initialValues={initialValues}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ValueTypeField />
                    </form>
                )}
            </Form>
        )

        const label = await result.findByTestId('dhis2-uicore-select-input')
        fireEvent.click(label)

        const textOption = (await result.findByText('Text')).closest(
            '[data-test="dhis2-uicore-singleselectoption"]'
        )
        expect(textOption).toBeTruthy()

        const multiTextOption = result.queryByText('Text with multiple values')
        expect(multiTextOption).toBeFalsy()
    })

    it('should have the MULTI_TEXT option when the selected value is MULTI_TEXT', async () => {
        const mockResult = {
            called: false,
            loading: false,
            fetching: false,
            error: null,
            data: null,
            refetch: jest.fn(),
        }
        uOSQ.mockImplementation(() => mockResult)

        const initialValues = {
            valueType: 'MULTI_TEXT',
            optionSet: [],
        }

        const result = render(
            <Form onSubmit={jest.fn()} initialValues={initialValues}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ValueTypeField />
                    </form>
                )}
            </Form>
        )

        const alabel = await result.findByTestId('dhis2-uicore-select-input')

        fireEvent.click(alabel)

        const textOption = (await result.findByText('Text')).closest(
            '[data-test="dhis2-uicore-singleselectoption"]'
        )
        expect(textOption).toBeVisible()

        const options = result.getAllByTestId('dhis2-uicore-singleselectoption')
        const multiTextOption = options.filter(
            (o) => within(o).queryByText('Text with multiple values') !== null
        )
        expect(multiTextOption).toHaveLength(1)
    })

    it("should have the MULTI_TEXT option auto-selected when the option set's valueType is MULTI_TEXT", async () => {
        const mockResult = {
            called: false,
            loading: false,
            fetching: false,
            error: null,
            data: { optionSets: { id: 'foo', valueType: 'MULTI_TEXT' } },
            refetch: jest.fn(),
        }
        uOSQ.mockImplementation(() => mockResult)

        const initialValues = {
            valueType: 'TEXT',
            optionSet: { id: 'foo' },
        }

        const result = render(
            <Form onSubmit={jest.fn()} initialValues={initialValues}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ValueTypeField />
                    </form>
                )}
            </Form>
        )

        const multiTextOption = await result.findByText(
            'Text with multiple values'
        )
        expect(multiTextOption).toBeTruthy()
    })
})
