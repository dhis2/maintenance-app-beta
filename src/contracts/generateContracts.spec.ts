import { writeFileSync, mkdirSync } from 'fs'
import { z, ZodSchema } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { categoryListSchema } from '../pages/categories/form'

const generateContract = ({
    method,
    path,
    name,
    expectedSchema,
}: {
    method: string
    path: string
    name: string
    expectedSchema: ZodSchema<any>
}) => {
    const contractPath = `contracts/${name}/contract.json`
    const schemaPath = `contracts/${name}/json-schema.json`
    const request = {
        name,
        httpMethod: method,
        requestUrl: path,
        responseStatus: 200,
        jsonSchema: schemaPath,
    }
    const schema = zodToJsonSchema(expectedSchema, name)
    mkdirSync(`contracts/${name}`, { recursive: true })
    writeFileSync(contractPath, JSON.stringify(request))
    writeFileSync(schemaPath, JSON.stringify(schema.definitions))
}

describe('contracts', () => {
    it('should generate all contracts', () => {
        generateContract({
            method: 'GET',
            path: 'categories',
            name: 'categories',
            expectedSchema: z.array(categoryListSchema),
        })
    })
})
