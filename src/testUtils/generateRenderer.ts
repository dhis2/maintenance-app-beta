import { FetchError } from '@dhis2/app-runtime'
import { faker } from '@faker-js/faker'
import { waitForElementToBeRemoved } from '@testing-library/react'
import { ModelSchemas } from '../lib'
import { useSchemaStore } from '../lib/schemas/schemaStore'
import { useCurrentUserStore } from '../lib/user/currentUserStore'
import { ModelSection } from '../types'
import type { OrganisationUnit } from '../types/generated'
import { testOrgUnit } from './builders'
export const error404 = new FetchError({
    type: 'unknown',
    message: '404 not found',
    details: { httpStatusCode: 404 } as FetchError['details'],
})
export const defaultUserDataStoreData = () =>
    Promise.reject(new FetchError(error404))

export const generateRenderer =
    (
        {
            section,
            mockSchema,
        }: { section: ModelSection; mockSchema: Record<any, any> },
        renderer: (routeOptions?: any, renderOptions?: Record<any, any>) => any
    ) =>
    async (renderOptions?: Record<any, any>) => {
        const routeOptions = {
            handle: { section },
        }
        useSchemaStore.getState().setSchemas({
            [section.name]: mockSchema,
        } as unknown as ModelSchemas)

        useCurrentUserStore.getState().setCurrentUser({
            organisationUnits: [testOrgUnit()] as OrganisationUnit[],
            authorities: new Set(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            settings: {},
        })

        const { screen, ...rest } = renderer(routeOptions, renderOptions)
        await waitForElementToBeRemoved(() =>
            screen.queryAllByTestId('dhis2-uicore-circularloader')
        )
        return { screen, ...rest }
    }
