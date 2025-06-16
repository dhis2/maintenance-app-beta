import dataSetNotificationTemplateSchemaMock from '../../__mocks__/schema/dataSetNotificationTemplatesSchema.json'
import { SECTIONS_MAP } from '../../lib'
import {
    testDataSetNotificationTemplate,
    testDataSet,
} from '../../testUtils/builders'
import { generateDefaultListTests } from '../defaultListTests'
import { Component as DataSetNotificationTemplateList } from './List'

const section = SECTIONS_MAP.dataSetNotificationTemplate
const mockSchema = dataSetNotificationTemplateSchemaMock
const ComponentToTest = DataSetNotificationTemplateList
const generateRandomElement = testDataSetNotificationTemplate
const customData = {
    dataSets: (type: any, params: any) => {
        if (type === 'read') {
            return {
                dataSets: [testDataSet(), testDataSet(), testDataSet()],
                pager: { page: 1, total: 3, pageSize: 20, pageCount: 1 },
            }
        }
    },
}

generateDefaultListTests({
    section,
    mockSchema,
    ComponentToTest,
    generateRandomElement,
    customData,
})

xdescribe('DataSetNotificationTemplate additional tests', () => {})
