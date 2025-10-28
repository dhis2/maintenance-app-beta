import schemaMock from '../../__mocks__/schema/analyticsTableHook.json'
import { SECTIONS_MAP } from '../../lib'
import { testanalyticsTableHookList } from '../../testUtils/builders'
import { generateDefaultListTests } from '../defaultListTests'
import { Component } from './List'

const section = SECTIONS_MAP.analyticsTableHook
const mockSchema = schemaMock
const ComponentToTest = Component
const generateRandomElement = testanalyticsTableHookList
const customData = {}

generateDefaultListTests({
    section,
    mockSchema,
    ComponentToTest,
    generateRandomElement,
    customData,
})
