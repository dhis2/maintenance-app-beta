/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { Form, useForm } from 'react-final-form'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { dataResolvers } from '../../../components/metadataFormControls/CategoryComboSelect/CategoryComboSelect.test'
import { ComponentWithProvider } from '../../../testUtils/TestComponentWithRouter'
import { CategoryComboField } from './CategoryComboField'

jest.mock('react-final-form', () => {
    const RFF = jest.requireActual('react-final-form')
    const useForm = jest.fn(() => ({ change: jest.fn() }))
    return { ...RFF, useForm }
})

describe('<CategoryComboField />', () => {
    it('should be required', async () => {
        const customData = { ...dataResolvers }
        const onSubmit = jest.fn()
        const router = createMemoryRouter([
            {
                path: '/',
                element: (
                    <Form
                        onSubmit={onSubmit}
                        initialValues={{ categoryCombo: { id: '' } }}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <CategoryComboField />
                                <button type="submit">Submit</button>
                            </form>
                        )}
                    </Form>
                ),
            },
        ])
        const result = render(
            <ComponentWithProvider dataForCustomProvider={customData}>
                <RouterProvider router={router} />
            </ComponentWithProvider>
        )

        const submitButton = await result.findByText('Submit', {
            selector: 'button',
        })
        fireEvent.click(submitButton)

        expect(
            result.getByTestId(
                'dataelementsformfields-categorycombo-validation'
            )
        ).toBeTruthy()
        expect(onSubmit).toHaveBeenCalledTimes(0)
    })

    it('should not be disabled when domainType is not tracker', () => {
        const customData = { ...dataResolvers }
        const onSubmit = jest.fn()
        const router = createMemoryRouter([
            {
                path: '/',
                element: (
                    <Form
                        onSubmit={onSubmit}
                        initialValues={{
                            domainType: 'AGGREGATE',
                            categoryCombo: { id: '' },
                        }}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <CategoryComboField />
                            </form>
                        )}
                    </Form>
                ),
            },
        ])

        const result = render(
            <ComponentWithProvider dataForCustomProvider={customData}>
                <RouterProvider router={router} />
            </ComponentWithProvider>
        )

        expect(result.container.querySelector('.disabled')).toBeFalsy()
    })

    it('should be disabled when domainType is set to tracker', async () => {
        const customData = { ...dataResolvers }
        const onSubmit = jest.fn()
        const router = createMemoryRouter([
            {
                path: '/',
                element: (
                    <Form
                        onSubmit={onSubmit}
                        initialValues={{
                            domainType: 'TRACKER',
                            categoryCombo: { id: '' },
                        }}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <CategoryComboField />
                            </form>
                        )}
                    </Form>
                ),
            },
        ])

        const result = render(
            <ComponentWithProvider dataForCustomProvider={customData}>
                <RouterProvider router={router} />
            </ComponentWithProvider>
        )

        expect(result.container.querySelector('.disabled')).toBeTruthy()
    })

    it('should change the value to the default category combo when domainType is set to tracker', async () => {
        const change = jest.fn()

        // Doing (useForm as jest.Mock).mockImplementation(...) causes some issues?
        const uF = useForm as jest.Mock
        uF.mockImplementation(() => ({ change }))

        const customData = {
            ...dataResolvers,
            categoryCombos: (...args: any[]) => {
                const [, query] = args

                if (query.params?.filter?.includes('isDefault:eq:true')) {
                    return Promise.resolve({
                        categoryCombos: [{ id: 'bjDvmb4bfuf' }],
                    })
                }

                return dataResolvers.categoryCombos(...args)
            },
        }
        const onSubmit = jest.fn()
        const router = createMemoryRouter([
            {
                path: '/',
                element: (
                    <Form
                        onSubmit={onSubmit}
                        initialValues={{
                            domainType: 'TRACKER',
                            categoryCombo: { id: '' },
                        }}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <CategoryComboField />
                            </form>
                        )}
                    </Form>
                ),
            },
        ])

        render(
            <ComponentWithProvider dataForCustomProvider={customData}>
                <RouterProvider router={router} />
            </ComponentWithProvider>
        )

        await waitFor(() => {
            expect(change).toHaveBeenCalledTimes(1)
            expect(change).toHaveBeenCalledWith(
                'categoryCombo.id',
                'bjDvmb4bfuf'
            )
        })
    })
})
