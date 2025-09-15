import schemaMock from '../../__mocks__/schema/validationRuleGroups.json'
import { SECTIONS_MAP } from '../../lib'
import { testValidationRuleGroups } from '../../testUtils/builders'
import { generateDefaultListTests } from '../defaultListTests'
import { Component } from './List'

const section = SECTIONS_MAP.validationRuleGroup
const mockSchema = schemaMock
const ComponentToTest = Component
const generateRandomElement = testValidationRuleGroups
const customData = {}

generateDefaultListTests({
    section,
    mockSchema,
    ComponentToTest,
    generateRandomElement,
    customData,
})
