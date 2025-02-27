import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'

type DataSetElement = {
    categoryCombo?: {
        id: string
        displayName: string
    }
    dataElement: {
        id: string
        displayName: string
        categoryCombo: {
            id: string
            displayName: string
        }
    }
    id: string
    displayName: string
}

type CategoryOptionCombo = {
    id: string
    displayName: string
}

type CategoryComboTruncated = {
    id: string
    displayName: string
    categoryOptionCombos: CategoryOptionCombo[]
}

type Option = {
    id: string
    displayName: string
    dataElement: {
        id: string
        displayName: string
    }
    categoryOptionCombo: {
        id: string
        displayName: string
    }
}

type CategoryComboResponse = {
    categoryCombos: CategoryComboTruncated[]
}

const getRelevantCategoryCombos = (value: DataSetElement[]) => {
    return value
        .map(
            (dse: DataSetElement) =>
                dse?.categoryCombo?.id ?? dse?.dataElement?.categoryCombo?.id
        )
        .sort()
}

const getOptions = ({
    categoryCombos,
    dataSetElements,
}: {
    categoryCombos: CategoryComboTruncated[]
    dataSetElements: DataSetElement[]
}): Option[] => {
    if (
        !categoryCombos ||
        !dataSetElements ||
        !categoryCombos?.length ||
        !dataSetElements?.length
    ) {
        return []
    }
    const catComboMap = new Map<string, CategoryOptionCombo[]>(
        categoryCombos?.map((cc: CategoryComboTruncated) => [
            cc.id,
            cc.categoryOptionCombos,
        ])
    )

    const options = dataSetElements.flatMap((dse) => {
        const categoryComboId =
            dse?.categoryCombo?.id ?? dse.dataElement.categoryCombo.id
        const categoryOptionCombos = catComboMap.get(categoryComboId)
        // return categoryOptionCombos
        return categoryOptionCombos?.map((coc: CategoryOptionCombo) => ({
            id: `${dse?.dataElement?.id}.${coc?.id}`,
            displayName: `${dse.displayName}: ${coc.displayName}`,
            dataElement: {
                id: dse?.dataElement?.id,
                displayName: dse?.dataElement?.displayName,
            },
            categoryOptionCombo: {
                id: coc?.id,
                displayName: coc?.displayName,
            },
        }))
    })
    return options.filter((opt) => opt !== undefined)
}

export const useCompulsoryDataElementOperandsQuery = ({
    dataSetElements,
}: {
    dataSetElements: DataSetElement[]
}) => {
    const queryFn = useBoundResourceQueryFn()
    const relevantCatCombos = getRelevantCategoryCombos(dataSetElements)

    const queryResult = useQuery({
        queryKey: [
            {
                resource: 'categoryCombos',
                params: {
                    fields: [
                        'id,displayName,categoryOptionCombos[id,displayName]',
                    ],
                    filter: [`id:in:[${relevantCatCombos.join(',')}]`],
                    paging: false,
                },
            },
        ],
        queryFn: queryFn<{ categoryCombos: CategoryComboTruncated[] }>,
        enabled: relevantCatCombos?.length > 0,
        staleTime: 60 * 1000,
        select: useCallback(
            (data: CategoryComboResponse) =>
                getOptions({
                    categoryCombos: data.categoryCombos,
                    dataSetElements,
                }),
            [dataSetElements]
        ),
    })

    return queryResult
}
