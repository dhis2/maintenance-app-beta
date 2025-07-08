import test from 'node:test'
import assert from 'node:assert'
import { eachLike } from '@pact-foundation/pact/src/v3/matchers.js'
import { fetchCategories } from './fetchCategories'
import { provider } from './pact'
import {zodToPactMatchers} from "./zodToPactMatchers";
import {categoryListSchema} from "../pages/categories/form/categorySchema";
import {ZodError} from "zod";
import {pickFromSchema} from "./pickFromSchema";


const fields = ['displayName','dataDimensionType','sharing[public]','lastUpdated','id','access','displayName']
const expectedResponseSchema = pickFromSchema(categoryListSchema, fields)
const expectedResponse= zodToPactMatchers(expectedResponseSchema, true)

test.before(async () => {
    provider
        .given("a full category list exists")
        .uponReceiving("a request for categories")
        .withRequest({
            method: "GET",
            query: {
                page: "1",
                pageSize: "20",
                filter: "name:ne:default",
                fields: "displayName,dataDimensionType,sharing[public],lastUpdated,id,access,displayName",
            },
            path: "/categories"
        })
        .willRespondWith({
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: eachLike(expectedResponse),
        })

    // Slim payload with only required fields
    // provider
    //     .given("a minimal category list exists")
    //     .uponReceiving("a request for minimal categories")
    //     .withRequest({
    //         method: "GET",
    //         path: "/categories?minimal=true",
    //     })
    //     .willRespondWith({
    //         status: 200,
    //         headers: { "Content-Type": "application/json; charset=utf-8" },
    //         body: eachLike(withoutOptional), // <-- excludes optional fields
    //     })

})

test('returns categories', async (t) => {
    await provider.executeTest(async (mockserver) => {
        process.env.API_PORT = mockserver.port.toString()
        const categories = await fetchCategories()
        try {
            categoryListSchema.parse(categories[0]);
        } catch (err) {
            if (err instanceof ZodError) {
                err.errors.forEach(e => {
                    console.error(`Error at path ${e.path.join('.')}: ${e.message}`);
                });
            } else {
                throw err; // rethrow if not a ZodError
            }
        }
        assert.equal(categories.length, 1)
    })
})
