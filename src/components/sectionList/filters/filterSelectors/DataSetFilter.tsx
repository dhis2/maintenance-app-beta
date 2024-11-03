import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSectionListFilter } from '../../../../lib'
import { PlainResourceQuery } from '../../../../types'
import { ModelMultiSelect } from '../../../metadataFormControls'
const query = {
    resource: 'dataSets',
    params: {
        fields: ['id', 'displayName'],
        order: 'displayName:asc',
        pageSize: 5,
    },
} as const satisfies PlainResourceQuery

export const DataSetFilter = () => {
    const [filter, setFilter] = useSectionListFilter('dataSet')

    return (
        <ModelMultiSelect
            query={query}
            selected={filter || []}
            prefix={i18n.t('Data set')}
            dense
            onChange={({ selected }) =>
                selected.length < 1
                    ? setFilter(undefined)
                    : setFilter(selected.map((s) => s.id))
            }
            select={(value) => [
                { id: 'NO_DATASET', displayName: '<No Data set>' },
                ...value,
            ]}
        />
    )

    // return (
    //     <ModelFilterSelect
    //         placeholder={i18n.t('Data set')}
    //         query={query}
    //         selected={selected}
    //         onChange={({ selected }) =>
    //             setFilter(selected ? [selected] : undefined)
    //         }
    //     />
    //  )
}
