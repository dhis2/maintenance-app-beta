import { useDataEngine } from '@dhis2/app-runtime'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryFunctionContext,
} from '@tanstack/react-query'
import type { Query } from '../../types'

// types not exported from app-runtime...
type DataEngine = ReturnType<typeof useDataEngine>
type Mutation = Parameters<DataEngine['mutate']>[0]
type GetMutationTypeUnion<MutationType extends string> = {
    [Type in Mutation as MutationType extends Type['type']
        ? 'type'
        : never]: Type['type']
}
type UpdateMutationTypeUnion = GetMutationTypeUnion<'update'>
type UpdateMutation = Extract<Mutation, UpdateMutationTypeUnion>
type UpdateMutationData = UpdateMutation['data']

type DataStoreOptions = {
    namespace: string
    key?: string
    global?: boolean
}

type ObjectResult = Record<string, unknown>

const createBoundQueryFn =
    <TData>(engine: DataEngine) =>
    ({ queryKey: [query], signal }: QueryFunctionContext<[Query]>) =>
        engine.query(query, { signal }) as Promise<TData> // engine.query is not generic...

const getDataStoreResource = (global?: boolean) =>
    global ? 'dataStore' : 'userDataStore'

type NamespaceOptions = Pick<DataStoreOptions, 'namespace' | 'global'>

type ValuesOptions = NamespaceOptions & { key: string }

type SetValuesOptions<ResultType> = ValuesOptions & {
    data: ResultType
}

export const queryCreators = {
    getKeys: ({ namespace, global }: NamespaceOptions) => ({
        result: {
            resource: `${getDataStoreResource(global)}`,
            id: namespace,
        },
    }),
    getValues: ({ namespace, global, key }: ValuesOptions) => ({
        result: {
            resource: `${getDataStoreResource(global)}`,
            id: `${namespace}/${key}`,
        },
    }),
    setValues: <TData>({
        namespace,
        global,
        key,
        data,
    }: SetValuesOptions<TData>): UpdateMutation => ({
        resource: `${getDataStoreResource(global)}`,
        id: `${namespace}/${key}`,
        type: 'update',
        // engine enforces data to be an object with keys, but can actually store any JSON-value
        data: data as UpdateMutationData,
    }),
}

const selectIdentity = <TData>(data: TData) => data

const defaultOptions = {
    global: false,
    select: selectIdentity,
}

type UseDataStoreValuesOptions<SelectResult, ResultType> = ValuesOptions & {
    placeholderData?: ResultType
    select?: (data: ResultType) => SelectResult
    enabled?: boolean
}
export function useDataStoreValuesQuery<
    ResultType = ObjectResult,
    SelectResult = ResultType
>(options: UseDataStoreValuesOptions<SelectResult, ResultType>) {
    const mergedOptions = {
        ...defaultOptions,
        ...options,
    }
    const select = mergedOptions.select
    const engine = useDataEngine()
    const query = queryCreators.getValues(mergedOptions)

    const placeholderData = mergedOptions.placeholderData
        ? { result: mergedOptions.placeholderData }
        : undefined

    return useQuery({
        queryKey: [query],
        queryFn: createBoundQueryFn(engine),
        placeholderData,
        // hide ".result" from consumer
        select: (data) => select(data.result) as SelectResult,
    })
}

export const useMutateDataStoreValuesQuery = (options: ValuesOptions) => {
    const mergedOptions = {
        ...defaultOptions,
        ...options,
    }

    const queryClient = useQueryClient()
    const engine = useDataEngine()
    const valuesQueryKey = [queryCreators.getValues(mergedOptions)]
    const mutationFn = async (data: ObjectResult) => {
        const mutation = queryCreators.setValues({
            namespace: mergedOptions.namespace,
            key: mergedOptions.key,
            global: mergedOptions.global,
            data,
        })
        return await engine.mutate(mutation)
    }
    const mutation = useMutation({
        mutationFn,
        onSettled: () => queryClient.invalidateQueries(valuesQueryKey),
    })
    return mutation
}
