import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import {
    getDefaultsOld,
    createFormValidate,
    modelFormSchemas,
    DEFAULT_CATEGORY_COMBO,
} from '../../../../lib'

const { identifiable, withDefaultListColumns, modelReference } =
    modelFormSchemas

const eventProgramBaseSchema = z.object({
    code: z.string().optional(),
    description: z.string().optional(),
    version: z.coerce
        .number()
        .int(i18n.t('Only integers are allowed'))
        .optional(),
    featureType: z.enum(['NONE', 'POINT', 'POLYGON']).optional(),
    categoryCombo: modelReference.default({ ...DEFAULT_CATEGORY_COMBO }),
    // trackedEntityType: object({
    //     id: z.string(),
    //     displayName: z.string().optional(),
    // }),
    // onlyEnrollOnce: z.boolean().default(true),
    // selectEnrollmentDatesInFuture: z.boolean().optional(),
    // displayIncidentDate: z.boolean().optional(),
    // selectIncidentDatesInFuture: z.boolean().optional(),
    // useFirstStageDuringRegistration: z.boolean().optional(),
    // ignoreOverdueEvents: z.boolean().optional(),
    // programTrackedEntityAttributes: z
    //     .array(
    //         z.object({
    //             trackedEntityAttribute: modelReference,
    //             allowFutureDate: z.boolean().default(false),
    //             mandatory: z.boolean().default(false),
    //             searchable: z.boolean().default(false),
    //             displayInList: z.boolean().default(false),
    //             renderType: z
    //                 .object({
    //                     MOBILE: z.object({ type: z.string() }).optional(),
    //                     DESKTOP: z.object({ type: z.string() }).optional(),
    //                 })
    //                 .optional(),
    //         })
    //     )
    //     .default([]),
    // dataEntryForm: z
    //     .object({
    //         name: z.string().optional(),
    //         displayName: z.string().optional(),
    //         htmlCode: z.string().optional(),
    //     })
    //     .optional(),
    style: z
        .object({
            color: z.string().optional(),
            icon: z.string().optional(),
        })
        .optional(),
    // programStageLabel: z.string().optional(),
    // eventLabel: z.string().optional(),
    // enrollmentDateLabel: z.string().optional(),
    incidentDateLabel: z.string().optional(),
    // enrollmentLabel: z.string().optional(),
    // followUpLabel: z.string().optional(),
    // orgUnitLabel: z.string().optional(),
    // relationshipLabel: z.string().optional(),
    // noteLabel: z.string().optional(),
    // displayFrontPageList: z.boolean().optional(),
    programStages: z
        .array(
            z.object({
                id: z.string().optional(),
                name: z.string().optional(),
                notificationTemplates: z
                    .array(z.object({ id: z.string().optional() }))
                    .default([]),
                dataEntryForm: z
                    .object({
                        id: z.string().optional(),
                        htmlCode: z.string().optional(),
                    })
                    .optional(),
                programStageDataElements: z
                    .array(z.object({ id: z.string().optional() }))
                    .default([]),
                programStageSections: z
                    .array(z.object({ id: z.string().optional() }))
                    .default([]),
            })
        )
        .default([
            {
                id: undefined,
                name: undefined,
                notificationTemplates: [],
                programStageDataElements: [],
                programStageSections: [],
            },
        ]),
    // organisationUnits: z.array(modelReference).default([]),
    // notificationTemplates: z.array(modelReference).default([]),
    // sharing: sharingSettingsSchema.optional(),
    expiryDays: z.coerce.number().int().min(0).default(0),
    expiryPeriodType: z.string().optional().default('Weekly'),
    completeEventsExpiryDays: z.coerce.number().int().min(0).default(0),
    openDaysAfterCoEndDate: z.coerce.number().min(0).default(0),
})

export const eventProgramFormSchema = identifiable
    .merge(eventProgramBaseSchema)
    .extend({
        shortName: z.string(),
        programType: z
            .enum(['WITHOUT_REGISTRATION'])
            .default('WITHOUT_REGISTRATION'),
    })

export const eventProgramListSchema = eventProgramBaseSchema.merge(
    withDefaultListColumns
)

export const eventProgramInitialValues = getDefaultsOld(eventProgramFormSchema)

export const eventProgramValidate = createFormValidate(eventProgramFormSchema)
