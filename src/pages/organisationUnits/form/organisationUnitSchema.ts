import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'

const { withAttributeValues, identifiable, referenceCollection } =
    modelFormSchemas

export const organisationUnitSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        shortName: z.string().trim().default(''),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        image: z.object({ id: z.string() }).optional(),
        phoneNumber: z
            .string()
            .min(0, { message: i18n.t('Must be a valid mobile number') })
            .max(150, { message: i18n.t('Must be a valid mobile number') })
            .optional(),
        contactPerson: z
            .string()
            .max(255, {
                message: i18n.t('Should not exceed {{maxLength}} characters', {
                    maxLength: 255,
                }),
            })
            .optional(),
        openingDate: z.coerce.date(),
        email: z.string().email().optional(),
        address: z
            .string()
            .max(230, {
                message: i18n.t('Should not exceed {{maxLength}} characters', {
                    maxLength: 255,
                }),
            })
            .optional(),
        url: z
            .string()
            .url({ message: i18n.t('Must be a valid url') })
            .optional(),
        closedDate: z.coerce.date().optional(),
        comment: z
            .string()
            .max(2000, {
                message: i18n.t('Should not exceed {{maxLength}} characters', {
                    maxLength: 2000,
                }),
            })
            .optional(),
        parent: z.object({ id: z.string(), path: z.string() }).optional(),
        geometry: z
            .object({
                type: z.literal('Point'),
                coordinates: z
                    .array(z.number())
                    .length(2)
                    .refine(
                        (coord) =>
                            coord[0] >= -90 &&
                            coord[0] <= 90 &&
                            coord[1] >= -180 &&
                            coord[1] <= 180,
                        {
                            message: i18n.t(
                                'Longitude should be between -90 and 90. Latitude should be between -180 and 180'
                            ),
                        }
                    ),
            })
            .or(
                z.object({
                    type: z.union([
                        z.literal('Multipoint'),
                        z.literal('Linestring'),
                        z.literal('Multilinestring'),
                        z.literal('Polygon'),
                        z.literal('Multipolygon'),
                        z.literal('Geometrycollection'),
                    ]),
                })
            )
            .optional(),
        programs: referenceCollection.optional().default([]),
        dataSets: referenceCollection.optional().default([]),
    })
    .refine(
        (orgUnit) => {
            if (!orgUnit.id) {
                return true
            }
            const isDescendantOfSelf = orgUnit.parent?.path.includes(orgUnit.id)
            return !isDescendantOfSelf
        },
        {
            message: i18n.t(
                'Parent organisation unit cannot be itself or a descendant of itself.'
            ),
            path: ['parent'],
        }
    )

export const initialValues = getDefaults(organisationUnitSchema)

export const validate = createFormValidate(organisationUnitSchema)
