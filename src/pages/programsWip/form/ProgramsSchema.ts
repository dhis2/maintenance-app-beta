import i18n from '@dhis2/d2-i18n'
import { object, z } from 'zod'
import {
    getDefaults,
    createFormValidate,
    modelFormSchemas,
    DEFAULT_CATEGORY_COMBO,
} from '../../../lib'

const { identifiable, withDefaultListColumns, modelReference } =
    modelFormSchemas

const sharingSettingsSchema = z.object({
    owner: z.string().optional(),
    external: z.boolean(),
    public: z.string().optional(),
    userGroups: z
        .record(
            z.object({
                id: z.string(),
                access: z.string(),
                displayName: z.string().optional(),
            })
        )
        .optional(),
    users: z
        .record(
            z.object({
                id: z.string(),
                access: z.string(),
                displayName: z.string().optional(),
            })
        )
        .optional(),
})

const programBaseSchema = z.object({
    code: z.string().optional(),
    description: z.string().optional(),
    version: z.coerce
        .number()
        .int(i18n.t('Only integers are allowed'))
        .optional(),
    featureType: z.enum(['NONE', 'POINT', 'POLYGON']).optional(),
    relatedProgram: modelReference.optional(),
    categoryCombo: modelReference.default({ ...DEFAULT_CATEGORY_COMBO }),
    trackedEntityType: object({
        id: z.string(),
        displayName: z.string().optional(),
    }),
    onlyEnrollOnce: z.boolean().default(true),
    selectEnrollmentDatesInFuture: z.boolean().optional(),
    displayIncidentDate: z.boolean().optional(),
    selectIncidentDatesInFuture: z.boolean().optional(),
    useFirstStageDuringRegistration: z.boolean().optional(),
    programTrackedEntityAttributes: z
        .array(
            z.object({
                trackedEntityAttribute: modelReference,
                allowFutureDate: z.boolean().default(false),
                mandatory: z.boolean().default(false),
                searchable: z.boolean().default(false),
                displayInList: z.boolean().default(false),
                renderType: z
                    .object({
                        MOBILE: z.object({ type: z.string() }).optional(),
                        DESKTOP: z.object({ type: z.string() }).optional(),
                    })
                    .optional(),
            })
        )
        .default([]),
    dataEntryForm: z
        .object({
            name: z.string().optional(),
            displayName: z.string().optional(),
            htmlCode: z.string().optional(),
        })
        .optional(),
    style: z
        .object({
            color: z.string().optional(),
            icon: z.string().optional(),
        })
        .optional(),
    programStageLabel: z.string().optional(),
    eventLabel: z.string().optional(),
    enrollmentDateLabel: z.string().optional(),
    incidentDateLabel: z.string().optional(),
    enrollmentLabel: z.string().optional(),
    followUpLabel: z.string().optional(),
    orgUnitLabel: z.string().optional(),
    relationshipLabel: z.string().optional(),
    noteLabel: z.string().optional(),
    displayFrontPageList: z.boolean().optional(),
    programStages: z.array(modelReference).default([]),
    organisationUnits: z.array(modelReference).default([]),
    sharing: sharingSettingsSchema.optional(),
})

export const programFormSchema = identifiable.merge(programBaseSchema).extend({
    name: z.string(),
    shortName: z.string(),
    programType: z.enum(['WITH_REGISTRATION']).default('WITH_REGISTRATION'),
})

export const programListSchema = programBaseSchema.merge(withDefaultListColumns)

export const initialValues = getDefaults(programFormSchema)

export const validate = createFormValidate(programFormSchema)
