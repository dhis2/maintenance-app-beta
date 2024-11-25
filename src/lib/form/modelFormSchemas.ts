import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'

/*  Note that these schemas describes validations for what we send to the server,
    and not what is stored in the form. Unknown keys are stripped by default. */

const modelReference = z.object({ id: z.string() })
const referenceCollection = z.array(modelReference)

/* Note that ID is optional here because we don't have ID when creating/POSTING models */
const identifiable = z.object({
    id: z.string().optional(),
    name: z.string().trim(),
})

const attributeValues = z
    .array(
        z.object({
            value: z.string().max(230, {
                message: i18n.t('Should not exceed {{maxLength}} characters', {
                    maxLength: 230,
                }),
            }),
            attribute: z.object({
                id: z.string(),
            }),
        })
    )
    .default([])

const withAttributeValues = z.object({
    attributeValues: attributeValues,
})

export const modelFormSchemas = {
    objectReference: modelReference,
    referenceCollection,
    identifiable,
    attributeValues,
    withAttributeValues,
    modelReference,
}
