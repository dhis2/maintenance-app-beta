import { useMemo } from 'react'
import { getTranslatedProperty } from '../../constants'
import { useSelectedColumns } from './listView/useSelectedColumns'
import type { SelectedColumns } from './types'

export const useHeaderColumns = () => {
    const { columns } = useSelectedColumns()

    const headerColumns: SelectedColumns = useMemo(() => {
        return columns.map((c) => ({
            modelPropertyName: c,
            label: getTranslatedProperty(c),
        }))
    }, [columns])
    return { headerColumns }
}
