import { render, waitForElementToBeRemoved } from '@testing-library/react'
import React from 'react'
import fullSchema from '../__mocks__/schema/fullSchema.json'
import { useSetSchemas } from '../lib/schemas'
import { useSetSystemSettings } from '../lib/systemSettings'
import { useSetCurrentUser } from '../lib/user'
import TestComponentWithRouter from '../testUtils/TestComponentWithRouter'
import { LoadApp } from './LoadApp'

jest.mock('../lib/schemas')
jest.mock('../lib/systemSettings')
jest.mock('../lib/user')

describe('LoadApp', () => {
    const setSchemaMock = jest.fn()
    const setSystemSettingsMock = jest.fn()
    const setUserMock = jest.fn()

    const mockUser = {
        name: 'dhis2 user',
        authorities: ['auth1', 'auth2-duplicated', 'auth2-duplicated', 'auth3'],
    }
    const mockSettings = {
        keyDateFormat: 'yyyy-MM-dd',
    }
    beforeEach(async () => {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(useSetSchemas as jest.Mock).mockImplementation(() => setSchemaMock)
        ;(useSetSystemSettings as jest.Mock).mockImplementation(
            () => setSystemSettingsMock
        )
        ;(useSetCurrentUser as jest.Mock).mockImplementation(() => setUserMock)

        const dataProvider = {
            schemas: fullSchema,
            me: mockUser,
            systemSettings: mockSettings,
        }

        const result = render(
            <TestComponentWithRouter
                path="/dataElements"
                dataProvider={dataProvider}
                routeOptions={{}}
            >
                <LoadApp>the app</LoadApp>
            </TestComponentWithRouter>
        )
        await waitForElementToBeRemoved(() =>
            result.queryByTestId('dhis2-uicore-circularloader')
        )
    })

    it('should set the schema before loading the app', async () => {
        expect(setSchemaMock.mock.lastCall).toMatchSnapshot()
    })

    it('should set the current useer before loading the app', async () => {
        expect(setUserMock.mock.lastCall[0]).toEqual({
            name: 'dhis2 user',
            authorities: new Set(['auth1', 'auth2-duplicated', 'auth3']),
        })
    })

    it('should set the systemm settings before loading the app', async () => {
        expect(setSystemSettingsMock.mock.lastCall[0]).toEqual(mockSettings)
    })
})
