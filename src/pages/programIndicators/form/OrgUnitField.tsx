import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useParams } from 'react-router-dom'
import { StandardFormField } from '../../../components'
import {
    ModelSingleSelect,
    ModelSingleSelectField,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import {
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useSchema,
} from '../../../lib'
import { getFieldFilter } from '../../../lib/models/path'
import {
    PickWithFieldFilters,
    Program,
    ProgramIndicator,
} from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'
import { ProgramIndicatorValues } from '../Edit'

const PROGRAM_TYPE_WITH_REGISTRATION = 'WITH_REGISTRATION'
const PROGRAM_TYPE_WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION'
const ANALYTICS_TYPE_EVENT = 'EVENT'
const ANALYTICS_TYPE_ENROLLMENT = 'ENROLLMENT'
const ORG_UNIT_VALUE_TYPE = 'ORGANISATION_UNIT'
const staticOptions = {
    eventDefault: {
        id: ANALYTICS_TYPE_EVENT,
        displayName: i18n.t('Event organisation unit default'),
    },
    enrollmentDefault: {
        id: ANALYTICS_TYPE_ENROLLMENT,
        displayName: i18n.t('Enrollment organisation unit default'),
    },
    enrollment: {
        id: ANALYTICS_TYPE_ENROLLMENT,
        displayName: i18n.t('Enrollment organisation unit'),
    },
    ownerAtStart: {
        id: 'OWNER_AT_START',
        displayName: i18n.t('Owner at start organisation unit'),
    },
    ownerAtEnd: {
        id: 'OWNER_AT_END',
        displayName: i18n.t('Owner at end organisation unit'),
    },
    registration: {
        id: 'REGISTRATION',
        displayName: i18n.t('Registration organisation unit'),
    },
}

export const OrgUnitField = () => {
    const programFilters = [
        'programStages[id,programStageDataElements[dataElement[id,displayName,valueType]]',
    ] as const
    const { input: orgUnitFieldInput, meta: orgUnitFieldMeta } =
        useField('analyticsType')
    const formValues = useFormState({ subscription: { values: true } }).values
    const queryFn = useBoundResourceQueryFn()
    const schema = useSchema(SECTIONS_MAP.programIndicator.name)
    const programType = formValues.program?.programType
    const programId = formValues.program?.id
    const analyticsType = formValues.analyticsType
    const hasRequiredParams = useMemo(() => {
        if (!programType) {
            return false
        }
        if (programType === PROGRAM_TYPE_WITHOUT_REGISTRATION) {
            return true
        }
        // For tracker programs we do need and analytics type
        if (programType === PROGRAM_TYPE_WITH_REGISTRATION && analyticsType) {
            return true
        }
        return false
    }, [programType, formValues])

    const extractOrgUnitDataElementsFromProgramStage = (program) => {
        return program.programStages.flatMap(({ programStageDataElements }) =>
            programStageDataElements.reduce((acc, { dataElement }) => {
                if (dataElement.valueType === ORG_UNIT_VALUE_TYPE) {
                    console.log('******YUPPIIII', dataElement)
                    acc.push(dataElement)
                }
                return acc
            }, [])
        )
    }

    const programAttributesForProgram = useMemo(() => {
        return formValues.program.programTrackedEntityAttributes.reduce(
            (acc, { trackedEntityAttribute }) => {
                if (trackedEntityAttribute.valueType === ORG_UNIT_VALUE_TYPE) {
                    acc.push({
                        id: trackedEntityAttribute.id,
                        displayName: trackedEntityAttribute.displayName,
                    })
                }
                return acc
            },
            []
        )
    }, [])

    const getOptionsForSelect = (results: DisplayableModel[]) => {
        const dataElements =
            results && results.length > 0
                ? extractOrgUnitDataElementsFromProgramStage(results[0])
                : []
        if (programType === PROGRAM_TYPE_WITHOUT_REGISTRATION) {
            return [staticOptions.eventDefault, ...dataElements]
        }

        if (
            programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType === ANALYTICS_TYPE_EVENT
        ) {
            return [
                staticOptions.eventDefault,
                ...programAttributesForProgram,
                ...dataElements,
                staticOptions.registration,
                staticOptions.enrollment,
                staticOptions.ownerAtStart,
                staticOptions.ownerAtEnd,
            ]
        }

        if (
            programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            analyticsType === ANALYTICS_TYPE_ENROLLMENT
        ) {
            return [
                staticOptions.enrollmentDefault,
                ...programAttributesForProgram,
                staticOptions.registration,
                staticOptions.ownerAtStart,
                staticOptions.ownerAtEnd,
            ]
        }

        return []
    }

    return hasRequiredParams ? (
        <StandardFormField>
            <ModelSingleSelectField<DisplayableModel>
                query={{
                    resource: 'programs',
                    params: {
                        fields: programFilters.concat(),
                        filter: [`id:eq:${programId}`],
                    },
                }}
                input={orgUnitFieldInput}
                meta={orgUnitFieldMeta}
                label={i18n.t('Organisationunit field')}
                transform={getOptionsForSelect}
            />
        </StandardFormField>
    ) : (
        <></>
    )
}
