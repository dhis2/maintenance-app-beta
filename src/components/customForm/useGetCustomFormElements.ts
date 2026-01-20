import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    useBoundResourceQueryFn,
    DEFAULT_CATEGORY_OPTION_COMBO,
} from '../../lib'
import { ProgramStateSectionDataElements } from '../../pages/programsWip/form/programStage/programStageSection/ProgramStageSectionFormContents'
import { ElementTypes } from './CustomFormElementsSelector'

type FlagItemResponse = { name: string; key: string; path: string }

const useGetFlags = () => {
    const queryFn = useBoundResourceQueryFn()

    const queryResult = useQuery({
        queryKey: [
            {
                resource: 'system/flags',
            },
        ],
        queryFn: queryFn<FlagItemResponse[]>,
        staleTime: 60 * 1000,
        enabled: true,
        select: useCallback((data: FlagItemResponse[]) => {
            const flagSet = new Set<string>()
            return (
                data
                    .map((flag) => ({ displayName: flag.name, id: flag.key }))
                    // there was a bug with duplicate Denmark flag (now fixed), but keeping this in case
                    .reduce((acc, flag) => {
                        if (!flagSet.has(flag.id)) {
                            flagSet.add(flag.id)
                            acc.push(flag)
                        }
                        return acc
                    }, [] as ElementItem[])
            )
        }, []),
    })

    return queryResult
}

type ElementItem = {
    id: string
    displayName: string
    key?: string
}
type DEO = {
    id: string
    displayName: string
    categoryOptionCombo: { id: string }
    dataElement: { id: string; displayName: string }
}
type DEOData = {
    dataElementOperands: DEO[]
}
type ProgramAttributeData = {
    programTrackedEntityAttributes: {
        trackedEntityAttribute: { id: string; displayName: string }
    }[]
}

export const useProgramsCustomFormElements = () => {
    const programId = useParams().id
    const queryFn = useBoundResourceQueryFn()
    const { data: attributesData, isLoading } = useQuery({
        queryFn: queryFn<ProgramAttributeData>,
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName~name]]',
                    ].concat(),
                },
            },
        ] as const,
    })

    const elementTypes = useMemo(() => {
        const attributes = attributesData?.programTrackedEntityAttributes?.map(
            (ptea) => ptea.trackedEntityAttribute
        )
        const programElements: ElementItem[] = [
            { id: 'enrollmentDate', displayName: i18n.t('Date of enrollment') },
            { id: 'incidentDate', displayName: i18n.t('Date of incident') },
        ]
        return [
            {
                name: i18n.t('Attributes'),
                elements: attributes,
                type: 'attribute',
            },
            {
                name: i18n.t('Program'),
                elements: programElements,
                type: 'program',
            },
        ] as ElementTypes
    }, [attributesData])

    return { loading: isLoading, elementTypes }
}

export const useDataSetCustomFormElements = () => {
    // get indicators from form state
    const dataSetId = useParams().id
    const { input: indicatorsInput } = useField('indicators')
    const indicators = indicatorsInput.value

    const queryFn = useBoundResourceQueryFn()
    const { data: deoData, isLoading } = useQuery({
        queryFn: queryFn<DEOData>,
        queryKey: [
            {
                resource: 'dataElementOperands',
                params: {
                    fields: [
                        'displayName',
                        'id',
                        'dataElement[id,displayName]',
                        'categoryOptionCombo[id]',
                    ].concat(),
                    dataSet: dataSetId,
                    paging: false,
                    order: 'displayName',
                },
            },
        ] as const,
    })
    const deOperands = deoData?.dataElementOperands

    const { dataElements, totals } = useMemo(() => {
        if (!deOperands) {
            return { dataElements: [], totals: [] }
        }
        const addedIds = new Set()

        const sorted = deOperands?.reduce(
            (
                acc: { dataElements: ElementItem[]; totals: ElementItem[] },
                deo
            ) => {
                // if operand coc is default, we use the display name of the data element, and do not add a total
                if (
                    deo.categoryOptionCombo.id ===
                    DEFAULT_CATEGORY_OPTION_COMBO.id
                ) {
                    acc.dataElements.push({
                        // this is to ensure consistent de.coc id format
                        id: `${deo.dataElement.id}.${deo.categoryOptionCombo.id}`,
                        displayName: deo.dataElement.displayName,
                        key: deo.id,
                    })
                    return acc
                }
                acc.dataElements.push({
                    id: deo.id,
                    displayName: deo.displayName,
                })
                // add the total the first time the data element is encountered
                if (!addedIds.has(deo.dataElement.id)) {
                    addedIds.add(deo.dataElement.id)
                    acc.totals.push({
                        id: deo.dataElement.id,
                        displayName: deo.dataElement.displayName,
                    })
                }
                return acc
            },
            { dataElements: [], totals: [] }
        )
        return sorted
    }, [deOperands])

    // get flags
    const flagsQuery = useGetFlags()
    const flags = useMemo(() => flagsQuery.data || [], [flagsQuery])

    const elementTypes = useMemo(
        () => [
            {
                name: i18n.t('Data elements'),
                elements: dataElements,
                type: 'dataElement',
            },
            { name: i18n.t('Totals'), elements: totals, type: 'total' },
            {
                name: i18n.t('Indicators'),
                elements: indicators,
                type: 'indicator',
            },
            { name: i18n.t('Flags'), elements: flags, type: 'flag' },
        ],
        [dataElements, totals, indicators, flags]
    )

    return { loading: flagsQuery.isLoading ?? isLoading, elementTypes }
}

export const useProgramsStageSectionCustomFormElements = (stageId: string) => {
    const queryFn = useBoundResourceQueryFn()
    const { data: deData, isLoading } = useQuery({
        queryFn: queryFn<ProgramStateSectionDataElements>,
        queryKey: [
            {
                resource: 'programStages',
                id: stageId,
                params: {
                    fields: [
                        'programStageDataElements[id,dataElement[id,displayName,categoryCombo[id]]]',
                    ].concat(),
                },
            },
        ] as const,
    })

    const dataElements = useMemo(() => {
        if (!deData) {
            return []
        }
        return deData.programStageDataElements
            ?.map((de) => ({
                id: `${stageId}-${de.dataElement.id}`,
                displayName: de.dataElement.displayName,
            }))
            .sort((de1, de2) => de1.displayName.localeCompare(de2.displayName))
    }, [deData, stageId])

    // get flags
    const flagsQuery = useGetFlags()
    const flags = useMemo(() => flagsQuery.data || [], [flagsQuery])

    const elementTypes = useMemo(
        () => [
            {
                name: i18n.t('Data elements'),
                elements: dataElements,
                type: 'dataElement',
            },
            { name: i18n.t('Flags'), elements: flags, type: 'flag' },
        ],
        [dataElements, flags]
    )

    return { loading: flagsQuery.isLoading ?? isLoading, elementTypes }
}
