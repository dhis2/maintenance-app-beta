import zodToJsonSchema from "zod-to-json-schema";
import {categoryListSchema} from "../pages/categories/form";
import { z } from 'zod'

describe('categories schemas', () => {
    it('should generate a contract', () => {
        const request = {
                "method": "GET",
                "path": "/categories",
                "query": {
                    "filter": ["name:ne:default"],
                    "page": ["1"],
                    "pageSize": ["20"]
                }
            }

        const schema= zodToJsonSchema(z.array(categoryListSchema), "categories")
        const toWrite = {request, schema}
        console.log("*********", JSON.stringify(toWrite.schema.definitions))
        expect(1+1).toBe(2)
    });
});
