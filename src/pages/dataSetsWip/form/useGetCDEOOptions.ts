import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useRef, useState } from 'react'
import { useField } from 'react-final-form'
import { CategoryCombo } from '../../../types/generated'

const QUERY_CATEGORY_OPTION_COMBOS = {
    categoryCombos: {
        resource: 'categoryCombos',
        params: (variables: Record<string, string[]>) => {
            const params = {
                fields: 'id,displayName,categoryOptionCombos[id,displayName]',
                filter: `id:in:[${variables.categoryCombos.join(',')}]`,
                paging: false,
            }
            return params
        },
    },
}

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

type QueryResponse = {
    categoryCombos: {
        categoryCombos: CategoryComboTruncated[]
    }
}

let compareCategoryCombosArray = (
    currentCCs: string[],
    newCCs: string[]
): boolean => {
    if (currentCCs.length !== newCCs.length) {
        return true
    }

    let index = 0
    for (const cc of newCCs) {
        if (cc !== currentCCs[index]) {
            return true
        }
    }
    return false
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
    categoryCombos: any
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
    const catComboMap = new Map<string, CategoryCombo[]>(
        categoryCombos?.map((cc: CategoryCombo) => [
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

export const useGetCDEOOptions = () => {
    const { input: dseInput } = useField('dataSetElements')
    const ref = useRef<string[]>([])
    const [options, setOptions] = useState<Option[] | null>(null)
    const [error, setError] = useState<Error | undefined>()
    const [loading, setLoading] = useState<boolean>(false)
    const engine = useDataEngine()

    useEffect(() => {
        const determineOptions = async () => {
            setLoading(true)
            const categoryCombos = getRelevantCategoryCombos(dseInput.value)
            let areCategoryCombosUpdated = compareCategoryCombosArray(
                ref.current,
                categoryCombos
            )

            if (!areCategoryCombosUpdated) {
                return
            }

            ref.current = categoryCombos

            // if empty clear
            if (!categoryCombos.length) {
                setOptions([])
            }

            const data = (await engine.query(QUERY_CATEGORY_OPTION_COMBOS, {
                variables: { categoryCombos: categoryCombos || [] },
            })) as unknown as QueryResponse
            const calculatedOptions = getOptions({
                categoryCombos: data?.categoryCombos?.categoryCombos,
                dataSetElements: dseInput.value,
            })
            setOptions(calculatedOptions)
        }
        try {
            determineOptions()
        } catch (e) {
            if (e instanceof Error) {
                setError(e as Error)
            } else {
                console.error(
                    'An unknown error occurred when retrieving compulsory data element operand options'
                )
            }
        } finally {
            setLoading(false)
        }
    }, [dseInput.value])

    return { options, loading, error }
}
