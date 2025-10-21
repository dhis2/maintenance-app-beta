import schemaMock from '../../__mocks__/schema/iconSchema.json'
import { SECTIONS_MAP } from '../../lib'
import { testIconGroup } from '../../testUtils/builders'
import { generateDefaultListTests } from '../defaultListTests'
import { Component } from './List'

const section = SECTIONS_MAP.icon
const mockSchema = schemaMock
const ComponentToTest = Component
const generateRandomElement = testIconGroup
const customData = {}

generateDefaultListTests({
    section,
    mockSchema,
    ComponentToTest,
    generateRandomElement,
    customData,
})
