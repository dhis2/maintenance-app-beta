import { render } from '@testing-library/react'
import React from 'react'
import { Form } from 'react-final-form'
import { AggregationTypeField } from '../../../components/form/fields/AggregationTypeField'
import { AGGREGATION_TYPE, useSchemas } from '../../../lib'

const aggregationTypes = Object.keys(AGGREGATION_TYPE)

jest.mock('../../../lib/schemas/schemaStore', () => {
    return {
        ...jest.requireActual('../../../lib/schemas/schemaStore'),
        useSchemas: jest.fn(),
    }
})

describe('<AggregationTypeField />', () => {
    const uS = useSchemas as jest.Mock
    uS.mockImplementation(() => ({
        dataElement: {
            properties: {
                aggregationType: { constants: aggregationTypes },
            },
        },
    }))

    const disabledValueTypes = [
        'TEXT',
        'LONG_TEXT',
        'MULTI_TEXT',
        'LETTER',
        'PHONE_NUMBER',
        'EMAIL',
        'TRACKER_ASSOCIATE',
        'USERNAME',
        'FILE_RESOURCE',
        'COORDINATE',
    ]
    const enabledValueTypes = aggregationTypes.filter(
        (aggregationType) => !disabledValueTypes.includes(aggregationType)
    )
    const disabelValueTypes = [
        ...enabledValueTypes.map((aggregationType) => [aggregationType, false]),
        ...disabledValueTypes.map((aggregationType) => [aggregationType, true]),
    ]
    describe.each(disabelValueTypes)(
        'disabled should be $disabled for $aggregationType',
        (valueType, disabled) => {
            test(`should be ${
                disabled ? 'disabled' : 'enabled'
            } for valueType ${valueType}`, async () => {
                const initialValues = {
                    valueType,
                    aggregationType: 'SUM',
                }

                const result = render(
                    <Form onSubmit={jest.fn()} initialValues={initialValues}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <AggregationTypeField />
                            </form>
                        )}
                    </Form>
                )

                const input = await result.findByTestId(
                    'dhis2-uicore-select-input'
                )
                expect(input.classList.contains('disabled')).toBe(disabled)

                const sumElement = result.queryByText('Sum')
                if (disabled) {
                    expect(sumElement).toBeFalsy()
                } else {
                    expect(sumElement).toBeTruthy()
                }
            })
        }
    )
})
