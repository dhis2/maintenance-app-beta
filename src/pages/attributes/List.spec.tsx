import schemaMock from '../../__mocks__/schema/attributeSchema.json'
import { SECTIONS_MAP } from '../../lib'
import { testAttribute } from '../../testUtils/builders'
import { generateDefaultListTests } from '../defaultListTests'
import { Component } from './List'

const section = SECTIONS_MAP.attribute
const mockSchema = schemaMock
const ComponentToTest = Component
const generateRandomElement = testAttribute
const customData = {}

generateDefaultListTests({
    section,
    mockSchema,
    ComponentToTest,
    generateRandomElement,
    customData,
})
