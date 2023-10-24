import i18n from '@dhis2/d2-i18n'
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import { SelectOption, QueryResponse } from '../../../types'
import { Pager } from '../../../types/generated'
import { SearchableSingleSelect } from '../../SearchableSingleSelect'

function computeDisplayOptions({
    selected,
    selectedOption,
    required,
    options,
}: {
    options: SelectOption[]
    selected?: string
    required?: boolean
    selectedOption?: SelectOption
}): SelectOption[] {
    // This happens only when we haven't fetched the lable for an initially
    // selected value. Don't show anything to prevent error that an option is
    // missing
    if (!selectedOption && selected) {
        return []
    }

    const optionsContainSelected = options?.find(
        ({ value }) => value === selected
    )

    const withSelectedOption =
        selectedOption && !optionsContainSelected
            ? [...options, selectedOption]
            : options

    if (!required) {
        // This default value has been copied from the old app
        return [
            { value: '', label: i18n.t('<No value>') },
            ...withSelectedOption,
        ]
    }

    return withSelectedOption
}

type UseInitialOptionQuery = ({
    selected,
    onComplete,
}: {
    onComplete: (option: SelectOption) => void
    selected?: string
}) => QueryResponse

export interface ModelSingleSelectProps {
    onChange: ({ selected }: { selected: string }) => void
    required?: boolean
    invalid?: boolean
    placeholder?: string
    prefix?: string
    selected?: string
    showAllOption?: boolean
    onBlur?: () => void
    onFocus?: () => void
    useInitialOptionQuery: UseInitialOptionQuery
    useOptionsQuery: () => QueryResponse
}

export const ModelSingleSelect = forwardRef(function ModelSingleSelect(
    {
        onChange,
        invalid,
        placeholder = '',
        prefix,
        required,
        selected,
        showAllOption,
        onBlur,
        onFocus,
        useInitialOptionQuery,
        useOptionsQuery,
    }: ModelSingleSelectProps,
    ref
) {
    // Using a ref because we don't want to react to changes.
    // We're using this value only when imperatively calling `refetch`,
    // nothing that depends on the render-cycle depends on this value
    const filterRef = useRef('')
    const pageRef = useRef(0)

    // We need to persist the selected option so we can display an <Option />
    // when the current list doesn't contain the selected option (e.g. when
    // the page with the selected option hasn't been reached yet or when
    // filtering)
    const [selectedOption, setSelectedOption] = useState<SelectOption>()

    const optionsQuery = useOptionsQuery()
    const initialOptionQuery = useInitialOptionQuery({
        selected,
        onComplete: setSelectedOption,
    })

    const { refetch, data } = optionsQuery
    const pager = (data as { pager: Pager })?.pager
    const page = pager?.page || 0
    const pageCount = pager?.pageCount || 0

    useImperativeHandle(
        ref,
        () => ({
            refetch: () => {
                pageRef.current = 1
                refetch({ page: pageRef.current, filter: filterRef.current })
            },
        }),
        [refetch]
    )

    const adjustQueryParamsWithChangedFilter = useCallback(
        ({ value }: { value: string }) => {
            pageRef.current = 1
            filterRef.current = value
            refetch({ page: pageRef.current, filter: value })
        },
        [refetch]
    )

    const incrementPage = useCallback(() => {
        pageRef.current = page + 1
        refetch({ page: pageRef.current, filter: filterRef.current })
    }, [refetch, page])

    const loading =
        optionsQuery.fetching ||
        optionsQuery.loading ||
        initialOptionQuery.loading
    const error =
        optionsQuery.error || initialOptionQuery.error
            ? // @TODO: Ask Joe what do do here!
              'An error has occurred. Please try again'
            : ''
    const result = (data as { result: SelectOption[] })?.result || []

    const displayOptions = computeDisplayOptions({
        selected,
        selectedOption,
        required,
        options: result,
    })

    return (
        <SearchableSingleSelect
            invalid={invalid}
            placeholder={placeholder}
            prefix={prefix}
            showAllOption={showAllOption}
            onChange={({ selected }) => {
                if (selected === selectedOption?.value) {
                    setSelectedOption(undefined)
                } else {
                    const option = result.find(
                        ({ value }) => value === selected
                    )
                    setSelectedOption(option)
                }

                onChange({ selected })
            }}
            onEndReached={incrementPage}
            options={displayOptions}
            selected={selected}
            showEndLoader={!loading && page < pageCount}
            onFilterChange={adjustQueryParamsWithChangedFilter}
            loading={loading}
            error={error}
            onRetryClick={() => {
                refetch({
                    page: pageRef.current,
                    filter: filterRef.current,
                })
            }}
            onBlur={onBlur}
            onFocus={onFocus}
        />
    )
})
