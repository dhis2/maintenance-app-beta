import { useMemo } from 'react'
import { useModelListView } from './listView'
import type { SelectedColumn } from './types'

export const useHeaderColumns = () => {
    const { columns } = useModelListView()

    const headerColumns: SelectedColumn[] = useMemo(() => {
        return columns.map((c) => ({
            path: c.path,
            label: c.label,
        }))
    }, [columns])
    return { headerColumns }
}
