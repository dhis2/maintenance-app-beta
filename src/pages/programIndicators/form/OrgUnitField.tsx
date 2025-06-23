import i18n from '@dhis2/d2-i18n'
import React, { useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { DisplayableModel } from '../../../types/models'

const PROGRAM_TYPE_WITH_REGISTRATION = 'WITH_REGISTRATION'
const PROGRAM_TYPE_WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION'
const ANALYTICS_TYPE_EVENT = 'EVENT'
const ANALYTICS_TYPE_ENROLLMENT = 'ENROLLMENT'
const ORG_UNIT_VALUE_TYPE = 'ORGANISATION_UNIT'
export const staticOptions = {
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

type DisplayableModelAndValueType = DisplayableModel & { valueType: string }
type ProgramStagesType = {
    programStages?: {
        id: string
        programStageDataElements: {
            dataElement: DisplayableModelAndValueType
        }[]
    }[]
    id: string
}

export const OrgUnitField = () => {
    const programFilters = [
        'programStages[id,programStageDataElements[dataElement[id,displayName,valueType]],id',
    ] as const
    const { input: orgUnitFieldInput, meta: orgUnitFieldMeta } = useField(
        'orgUnitField',
        {
            format: (value) => {
                return { id: value }
            },
            parse: (value) => {
                return value.id
            },
        }
    )
    const formValues = useFormState({ subscription: { values: true } }).values
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

    const extractOrgUnitDataElementsFromProgramStage = (
        program: ProgramStagesType
    ): DisplayableModel[] => {
        if (!program.programStages) {
            return []
        }

        return program.programStages.flatMap(({ programStageDataElements }) =>
            programStageDataElements.reduce(
                (acc: DisplayableModel[], { dataElement }) => {
                    if (dataElement.valueType === ORG_UNIT_VALUE_TYPE) {
                        acc.push(dataElement)
                    }
                    return acc
                },
                []
            )
        )
    }

    const programAttributesForProgram: DisplayableModel[] = useMemo(() => {
        if (!formValues?.program?.programTrackedEntityAttributes) {
            return []
        }
        return formValues.program.programTrackedEntityAttributes.reduce(
            (
                acc: DisplayableModel[],
                {
                    trackedEntityAttribute,
                }: {
                    trackedEntityAttribute: {
                        id: string
                        displayName: string
                        valueType: string
                    }
                }
            ) => {
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
    }, [formValues.program])

    const getOptionsForSelect = (values: ProgramStagesType[]) => {
        const dataElements =
            values && values.length > 0
                ? extractOrgUnitDataElementsFromProgramStage(values[0])
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
        <ModelSingleSelectField
            dataTest="org-unit-field"
            query={{
                resource: 'programs',
                params: {
                    fields: programFilters.concat(),
                    filter: [`id:eq:${programId}`],
                },
            }}
            inputWidth="400px"
            input={orgUnitFieldInput}
            meta={orgUnitFieldMeta}
            label={i18n.t('Organisation unit field')}
            transform={getOptionsForSelect}
        />
    ) : (
        <></>
    )
}
