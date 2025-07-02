import test from 'node:test'
import assert from 'node:assert'
import { eachLike } from '@pact-foundation/pact/src/v3/matchers.js'
import { fetchCategories } from './fetchCategories'
import { provider } from './pact'
import {zodToPactMatchers} from "./zodToPactMatchers";
import {categoryListSchema} from "../pages/categories/form/categorySchema";
import {ZodError} from "zod";


const  withAllFields= zodToPactMatchers(categoryListSchema, true);
const  withoutOptional = zodToPactMatchers(categoryListSchema, false);

test.before(async () => {
    provider
        .given("a full category list exists")
        .uponReceiving("a request for full categories")
        .withRequest({
            method: "GET",
            path: "/categories",
        })
        .willRespondWith({
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: eachLike(withAllFields), // <-- includes optional fields
        })

    // Slim payload with only required fields
    provider
        .given("a minimal category list exists")
        .uponReceiving("a request for minimal categories")
        .withRequest({
            method: "GET",
            path: "/categories?minimal=true",
        })
        .willRespondWith({
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: eachLike(withoutOptional), // <-- excludes optional fields
        })

})

test('returns orders', async (t) => {
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
