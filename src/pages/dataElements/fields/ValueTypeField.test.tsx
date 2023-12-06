import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { Form } from 'react-final-form'
import { useSchemas, useOptionSetQuery } from '../../../lib'
import { ValueTypeField } from './ValueTypeField'

jest.mock('../../../lib/optionSet/useOptionSetQuery', () => ({
    useOptionSetQuery: jest.fn(),
}))

jest.mock('../../../lib/schemas/schemaStore', () => {
    return {
        ...jest.requireActual('../../../lib/schemas/schemaStore'),
        useSchemas: jest.fn(),
    }
})

// `(useOptionSetQuery as jest.Mock).mockImplementation` causes the code to be
// built wrongly and subsequently to bug out
const uOSQ = useOptionSetQuery as jest.Mock
const uS = useSchemas as jest.Mock

const valueTypes = [
    'TEXT',
    'LONG_TEXT',
    'MULTI_TEXT',
    'LETTER',
    'PHONE_NUMBER',
    'EMAIL',
    'BOOLEAN',
    'TRUE_ONLY',
    'DATE',
    'DATETIME',
    'TIME',
    'NUMBER',
    'UNIT_INTERVAL',
    'PERCENTAGE',
    'INTEGER',
    'INTEGER_POSITIVE',
    'INTEGER_NEGATIVE',
    'INTEGER_ZERO_OR_POSITIVE',
    'TRACKER_ASSOCIATE',
    'USERNAME',
    'COORDINATE',
    'ORGANISATION_UNIT',
    'REFERENCE',
    'AGE',
    'URL',
    'FILE_RESOURCE',
    'IMAGE',
    'GEOJSON',
]

describe('<ValueTypeField />', () => {
    it('should not have the MULTI_TEXT option when a different value is selected', async () => {
        const uS = useSchemas as jest.Mock
        uS.mockImplementation(() => ({
            dataElement: {
                properties: {
                    valueType: { constants: valueTypes },
                },
            },
        }))

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

        const textOption = await result.findByText('Text', {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })
        expect(textOption).toBeTruthy()

        const multiTextOption = result.queryByText(
            'Text with multiple values',
            {
                selector: '[data-test="dhis2-uicore-singleselectoption"]',
            }
        )
        expect(multiTextOption).toBeFalsy()
    })

    it('should have the MULTI_TEXT option when the selected value is MULTI_TEXT', async () => {
        const uS = useSchemas as jest.Mock
        uS.mockImplementation(() => ({
            dataElement: {
                properties: {
                    valueType: { constants: valueTypes },
                },
            },
        }))

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

        const label = await result.findByTestId('dhis2-uicore-select-input')
        fireEvent.click(label)

        await result.findByText('Text', {
            selector: '[data-test="dhis2-uicore-singleselectoption"]',
        })

        const multiTextOption = result.queryByText(
            'Text with multiple values',
            {
                selector: '[data-test="dhis2-uicore-singleselectoption"]',
            }
        )
        expect(multiTextOption).toBeTruthy()
    })

    it("should have the MULTI_TEXT option auto-selected when the option set's valueType is MULTI_TEXT", async () => {
        uS.mockImplementation(() => ({
            dataElement: {
                properties: {
                    valueType: { constants: valueTypes },
                },
            },
        }))

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
