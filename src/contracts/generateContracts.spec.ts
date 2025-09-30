import { writeFileSync, mkdirSync } from 'fs'
import { ZodSchema } from 'zod'
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
        jsonSchema: `contracts/maintenance-app/${name}/json-schema.json`,
    }
    const schema = zodToJsonSchema(expectedSchema, {
        name,
        // @ts-expect-error/rejected-must-be-true
        rejectedAdditionalProperties: true,
        $refStrategy: 'none',
    })
    mkdirSync(`contracts/${name}`, { recursive: true })
    writeFileSync(contractPath, JSON.stringify(request, null, 2))
    writeFileSync(
        schemaPath,
        JSON.stringify(schema.definitions?.[name], null, 2)
    )
}

describe('contracts', () => {
    it('should generate all contracts', () => {
        generateContract({
            method: 'GET',
            path: '/categories/{id}',
            name: 'category',
            expectedSchema: categoryListSchema,
        })
    })
})
