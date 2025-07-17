import i18n from '@dhis2/d2-i18n'
import { Transfer } from '@dhis2/ui'
import React, {
    ReactElement,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import { SelectOption } from '../../../types'
import { useInitialOptionQuery } from './useInitialOptionQuery'
import { useOptionsQuery } from './useOptionsQuery'

function computeDisplayOptions({
    selected,
    selectedOptions,
    options,
}: {
    options: SelectOption[]
    selected: string[]
    selectedOptions: SelectOption[]
}): SelectOption[] {
    // This happens only when we haven't fetched the lable for an initially
    // selected value. Don't show anything to prevent error that an option is
    // missing
    if (!selectedOptions.length && selected.length) {
        return []
    }

    const missingSelectedOptions = selectedOptions.filter((selectedOption) => {
        return !options?.find((option) => option.value === selectedOption.value)
    })

    return [...options, ...missingSelectedOptions]
}

interface LegendSetSelectProps {
    onChange: ({ selected }: { selected: string[] }) => void
    selected: string[]
    rightHeader?: ReactElement
    rightFooter?: ReactElement
    leftFooter?: ReactElement
    leftHeader?: ReactElement
}

export const LegendSetTransfer = forwardRef(function LegendSetSelect(
    {
        onChange,
        selected,
        rightHeader,
        rightFooter,
        leftFooter,
        leftHeader,
    }: LegendSetSelectProps,
    ref
) {
    // Using a ref because we don't want to react to changes.
    // We're using this value only when imperatively calling `refetch`,
    // nothing that depends on the render-cycle depends on this value
    const [searchTerm, setSearchTerm] = useState('')
    const pageRef = useRef(0)

    // We need to persist the selected option so we can display an <Option />
    // when the current list doesn't contain the selected option (e.g. when
    // the page with the selected option hasn't been reached yet or when
    // filtering)
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([])

    const optionsQuery = useOptionsQuery()
    const initialOptionQuery = useInitialOptionQuery({
        selected,
        onComplete: setSelectedOptions,
    })

    const { refetch, data } = optionsQuery
    const pager = data?.pager
    const page = pager?.page || 0
    const pageCount = pager?.pageCount || 0

    const loading =
        optionsQuery.fetching ||
        optionsQuery.loading ||
        initialOptionQuery.loading
    const error =
        optionsQuery.error || initialOptionQuery.error
            ? // @TODO: Ask Joe what do do here!
              'An error has occurred. Please try again'
            : ''

    useImperativeHandle(
        ref,
        () => ({
            refetch: () => {
                pageRef.current = 1
                refetch({ page: pageRef.current, filter: searchTerm })
            },
        }),
        [refetch, searchTerm]
    )

    const adjustQueryParamsWithChangedFilter = useCallback(
        ({ value }: { value: string | undefined }) => {
            value = value ?? ''
            setSearchTerm(value)
            pageRef.current = 1
            refetch({ page: pageRef.current, filter: value })
        },
        [refetch]
    )

    const incrementPage = useCallback(() => {
        if (optionsQuery.loading || page === pageCount) {
            return
        }

        pageRef.current = page + 1
        refetch({ page: pageRef.current, filter: searchTerm })
    }, [refetch, page, optionsQuery.loading, searchTerm, pageCount])

    const displayOptions = computeDisplayOptions({
        selected,
        selectedOptions,
        options: data?.result || [],
    })

    return (
        <Transfer
            dataTest="legendset-transfer"
            filterable
            filterPlaceholder={i18n.t('Filter legend sets')}
            searchTerm={searchTerm}
            options={displayOptions}
            selected={selected}
            loading={loading}
            onChange={({ selected }: { selected: string[] }) => {
                const nextSelectedOptions = displayOptions.filter(({ value }) =>
                    selected.includes(value)
                )
                setSelectedOptions(nextSelectedOptions)
                onChange({ selected })
            }}
            onEndReached={incrementPage}
            onFilterChange={adjustQueryParamsWithChangedFilter}
            rightHeader={rightHeader}
            rightFooter={rightFooter}
            leftHeader={leftHeader}
            leftFooter={leftFooter}
        />
    )
})
