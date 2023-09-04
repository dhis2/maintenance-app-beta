import { render } from '@testing-library/react'
import React from 'react'
import { Loader } from './Loader'

describe('Loader', () => {
    it('should show the spinner and defer showing the content while loading', () => {
        const response: any = {
            loading: true,
        }
        const { getByRole, queryByText } = render(
            <Loader queryResponse={response}>
                <div>content</div>
            </Loader>
        )

        expect(getByRole('progressbar')).not.toBeNull()
        expect(queryByText('content')).toBeNull()
    })
    it('should show error message when response fails', () => {
        const response: any = {
            error: true,
        }
        const { getByTestId } = render(
            <Loader queryResponse={response}>
                <div>content</div>
            </Loader>
        )

        expect(getByTestId('loader-notice-box')).toHaveTextContent(
            'Failed to load'
        )
    })
    it('should show error message in response when there is one', () => {
        const response: any = {
            error: {
                message: 'not authorised',
            },
        }
        const { getByTestId } = render(
            <Loader queryResponse={response}>
                <div>content</div>
            </Loader>
        )

        expect(getByTestId('loader-notice-box')).toHaveTextContent(
            'Failed to load: not authorised.'
        )
    })
    it('should show content when loaded successfully', () => {
        const response: any = {}
        const { getByText } = render(
            <Loader queryResponse={response}>
                <div>success content</div>
            </Loader>
        )

        expect(getByText('success content')).not.toBeNull()
    })
})
