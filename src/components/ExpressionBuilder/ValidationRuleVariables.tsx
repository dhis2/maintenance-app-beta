import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React, { useCallback, useState } from 'react'
import { SchemaName, useSchema, getConstantTranslation } from '../../lib'
import { ModelSingleSelect } from '../metadataFormControls/ModelSingleSelect'
import styles from './ExpressionBuilder.module.css'
import { ExpressionList, ExpressionListInner } from './ExpressionList'

export type InsertElementType = (s: string) => void
type Element = {
    id: string
    displayName: string
}
export type ElementType = {
    type: string
    name: string
    elements?: Element[]
    component: React.ComponentType<{
        elements: Element[]
        insertElement: InsertElementType
    }>
}
type BasicIdentifiable = {
    id: string
    displayName: string
}
type ProgramTEA = BasicIdentifiable & {
    trackedEntityAttribute: { id: string }
}

type ProgramWithTEA = {
    programTrackedEntityAttributes: ProgramTEA[]
}

const DefaultList = ({
    elements,
    insertElement,
}: {
    elements: Element[]
    insertElement: InsertElementType
}) => {
    return (
        <ExpressionListInner
            elements={elements}
            insertElement={insertElement}
            postQuerySearch={true}
            onRetryClick={() => {}}
        ></ExpressionListInner>
    )
}

const DATA_ELEMENTS_QUERY = {
    resource: 'dataElementOperands',
    params: {
        fields: ['id', 'displayName'],
        order: ['displayName'],
        totals: true,
        filters: ['dataElement.domainType:eq:AGGREGATE'],
    },
}

const DataElementsList = ({
    insertElement,
}: {
    insertElement: InsertElementType
}) => {
    const insertElementFormatted = useCallback(
        (s: string) => {
            insertElement(`#{${s}}`)
        },
        [insertElement]
    )
    return (
        <ExpressionList
            query={DATA_ELEMENTS_QUERY}
            insertElement={insertElementFormatted}
        />
    )
}

const ORGANISATION_UNIT_GROUPS_QUERY = {
    resource: 'organisationUnitGroups',
    params: {
        fields: ['id', 'displayName'],
        order: ['displayName'],
    },
}

const OrganisationUnitGroupsList = ({
    insertElement,
}: {
    insertElement: InsertElementType
}) => {
    const insertElementFormatted = useCallback(
        (s: string) => {
            insertElement(`OUG{${s}}`)
        },
        [insertElement]
    )
    return (
        <ExpressionList
            query={ORGANISATION_UNIT_GROUPS_QUERY}
            insertElement={insertElementFormatted}
        />
    )
}

const CONSTANTS_QUERY = {
    resource: 'constants',
    params: {
        fields: ['id', 'displayName'],
        order: ['displayName'],
    },
}

const ConstantsList = ({
    insertElement,
}: {
    insertElement: InsertElementType
}) => {
    const insertElementFormatted = useCallback(
        (s: string) => {
            insertElement(`C{${s}}`)
        },
        [insertElement]
    )
    return (
        <ExpressionList
            query={CONSTANTS_QUERY}
            insertElement={insertElementFormatted}
        />
    )
}

const DATA_SETS_QUERY = {
    resource: 'dataSets',
    params: {
        fields: ['id', 'displayName'],
        order: ['displayName'],
    },
}

const DataSetsList = ({
    insertElement,
}: {
    insertElement: InsertElementType
}) => {
    const schema = useSchema('reportingRate' as SchemaName)
    const reportingTypes =
        schema?.properties?.metric?.constants?.map((constant) => ({
            value: constant,
            label: getConstantTranslation(constant),
        })) || null
    const [reportingType, setReportingType] = useState<string>('REPORTING_RATE')
    const insertElementFormatted = useCallback(
        (s: string) => {
            insertElement(`R{${s}.${reportingType}}`)
        },
        [insertElement, reportingType]
    )
    if (!reportingTypes) {
        return null
    }
    return (
        <>
            <div className={styles.preliminarySelect}>
                <SingleSelect
                    selected={reportingType}
                    onChange={(e) => {
                        setReportingType(e.selected)
                    }}
                >
                    {reportingTypes.map((opt) => (
                        <SingleSelectOption
                            key={opt.value}
                            label={opt.label}
                            value={opt.value}
                        />
                    ))}
                </SingleSelect>
            </div>
            <ExpressionList
                query={DATA_SETS_QUERY}
                insertElement={insertElementFormatted}
            />
        </>
    )
}

const PROGRAMS_SELECT_QUERY = {
    resource: 'programs',
    params: {
        fields: ['id', 'displayName'],
    },
}

const ProgramJunction = ({
    programElementType,
    programId,
    insertElementFormatted,
}: {
    programElementType: string
    programId: string
    insertElementFormatted: (s: string) => void
}) => {
    // program data elements
    if (programElementType === 'D') {
        const programDataElementsQuery = {
            resource: 'programDataElements',
            params: {
                program: programId,
                fields: ['displayName', 'dataElement'],
            },
        }
        return (
            <ExpressionList
                query={programDataElementsQuery}
                insertElement={insertElementFormatted}
                transform={(
                    f: { displayName: string; dataElement: { id: string } }[]
                ) => f.map((d) => ({ ...d, id: d?.dataElement?.id }))}
            />
        )
    }
    // program indicators
    if (programElementType === 'I') {
        const programIndicatorsQuery = {
            resource: 'programIndicators',
            params: {
                filter: [`program.id:eq:${programId}`],
            },
        }
        return (
            <ExpressionList
                query={programIndicatorsQuery}
                insertElement={insertElementFormatted}
            />
        )
    }
    // program tracked entity attributes (have to be retrieved from program info)
    if (programElementType === 'A') {
        const programTEAQuery = {
            resource: 'programs',
            params: {
                filters: [`id:eq:${programId}`],
                fields: [
                    'programTrackedEntityAttributes[id,displayName,trackedEntityAttribute[id]]',
                ],
            },
        }
        return (
            <ExpressionList
                query={programTEAQuery}
                insertElement={insertElementFormatted}
                transform={(p) => {
                    const program = p[0] as unknown as ProgramWithTEA
                    const attributes =
                        program?.programTrackedEntityAttributes ?? []
                    return attributes.map((tea) => ({
                        displayName: tea.displayName,
                        id: tea.trackedEntityAttribute.id,
                    }))
                }}
                postQuerySearch={true}
            />
        )
    }
}

const programElementTypes = [
    { value: 'D', label: i18n.t('Data elements') },
    { value: 'A', label: i18n.t('Program tracked entity attributes') },
    { value: 'I', label: i18n.t('Indicators') },
]

const ProgramsList = ({
    insertElement,
}: {
    insertElement: InsertElementType
}) => {
    const [program, setProgram] = useState<BasicIdentifiable>()
    const programId = program?.id
    const [programElementType, setProgramElementType] = useState<string>(
        programElementTypes[0]?.value
    )
    const insertElementFormatted = useCallback(
        (s: string) => {
            if (programElementType === 'I') {
                insertElement(`${programElementType}{${s}}`)
            } else {
                insertElement(`${programElementType}{${programId}.${s}}`)
            }
        },
        [insertElement, programElementType, programId]
    )

    return (
        <>
            <div
                className={
                    !programElementType || !programId
                        ? styles.preliminarySelectNoProgram
                        : styles.preliminarySelect
                }
            >
                <ModelSingleSelect
                    query={PROGRAMS_SELECT_QUERY}
                    onChange={(program) => {
                        setProgram(program)
                    }}
                    placeholder={i18n.t('Select a Program')}
                    selected={program}
                />
                <div>
                    <SingleSelect
                        selected={programElementType}
                        onChange={(e) => {
                            setProgramElementType(e.selected)
                        }}
                    >
                        {programElementTypes.map((opt) => (
                            <SingleSelectOption
                                key={opt.value}
                                label={opt.label}
                                value={opt.value}
                            />
                        ))}
                    </SingleSelect>
                </div>
            </div>
            {!programElementType || !programId ? null : (
                <ProgramJunction
                    programElementType={programElementType}
                    programId={programId}
                    insertElementFormatted={insertElementFormatted}
                ></ProgramJunction>
            )}
        </>
    )
}

export const defaultElementTypes: ElementType[] = [
    {
        type: 'operator',
        name: i18n.t('Operators'),
        elements: [
            { id: '+', displayName: i18n.t('+ (add)') },
            { id: '-', displayName: i18n.t('- (subtract)') },
            { id: '*', displayName: i18n.t('* (multiply)') },
            { id: '/', displayName: i18n.t('/ (divide)') },
            { id: '%', displayName: i18n.t('% (percent)') },
            { id: '(', displayName: i18n.t('(') },
            { id: ')', displayName: i18n.t(')') },
            { id: 'days', displayName: i18n.t('days') },
            { id: 'if(', displayName: i18n.t('if(') },
            { id: 'isNull(', displayName: i18n.t('isNull(') },
            { id: 'isNotNull(', displayName: i18n.t('isNotNull(') },
            { id: 'firstNotNull(', displayName: i18n.t('firstNotNull(') },
            { id: 'greatest(', displayName: i18n.t('greatest(') },
            { id: 'least(', displayName: i18n.t('least(') },
        ],
        component: DefaultList,
    },
    {
        type: 'dataElement',
        name: i18n.t('Data elements'),
        component: DataElementsList,
    },
    {
        type: 'programs',
        name: i18n.t('Program data'),
        component: ProgramsList,
    },
    {
        type: 'organisationUnitGroups',
        name: i18n.t('Org unit counts'),
        component: OrganisationUnitGroupsList,
    },
    {
        type: 'constants',
        name: i18n.t('Constants'),
        component: ConstantsList,
    },
    {
        type: 'dataSets',
        name: i18n.t('Reporting rates'),
        component: DataSetsList,
    },
]
