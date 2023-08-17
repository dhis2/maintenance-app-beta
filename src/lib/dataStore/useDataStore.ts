import { FetchError, useDataEngine } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryFunctionContext,
} from 'react-query'
import { Query } from '../../types'

// types not exported from app-runtime...
type DataEngine = ReturnType<typeof useDataEngine>
type Mutation = Parameters<DataEngine['mutate']>[0]
type UpdateMutationTypeUnion = {
    [Type in Mutation as 'update' extends Type['type']
        ? 'type'
        : never]: Type['type']
}
type UpdateMutation = Extract<Mutation, UpdateMutationTypeUnion>
type UpdateMutationData = UpdateMutation['data']
// type UpdateMutation = { type: 'update' | 'replace' | 'json-patch'; /* other properties */ };
// type DeleteMutation = { type: 'delete'; /* other properties */ };

//type Mutation = UpdateMutation | DeleteMutation;

type DataStoreOptions = {
    namespace: string
    key?: string
    global?: boolean
}

type WrapInResult<TResult> = {
    result: TResult
}

type ObjectResult = Record<string, any>

const createBoundQueryFn =
    <TData>(engine: DataEngine) =>
    ({ queryKey: [query], signal }: QueryFunctionContext<[Query]>) =>
        engine.query(query, { signal }) as Promise<TData> // engine.query is not generic...

const getDataStoreResource = (global?: boolean) =>
    global ? 'dataStore' : 'userDataStore'

type GetNamespaceOptions = Pick<DataStoreOptions, 'namespace' | 'global'>

type GetValuesOptions = GetNamespaceOptions & { key: string }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SetValuesOptions<ResultType = any> = GetValuesOptions & {
    data: ResultType
}

const queryCreators = {
    getKeys: ({ namespace, global }: GetNamespaceOptions) => ({
        result: {
            resource: `${getDataStoreResource(global)}`,
            id: namespace,
        },
    }),
    getValues: ({ namespace, global, key }: GetValuesOptions) => ({
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

const defaultOptions = {
    global: false,
}

type UseDataStoreValuesOptions<ResultType> = GetValuesOptions & {
    placeholderData?: ResultType
}
export function useDataStoreValues<ResultType = ObjectResult>(
    options: UseDataStoreValuesOptions<ResultType>
) {
    const mergedOptions = {
        ...defaultOptions,
        ...options,
    }
    const query = queryCreators.getValues(mergedOptions)
    const queryClient = useQueryClient()
    const engine = useDataEngine()

    const queryResult = useQuery({
        queryKey: [query],
        queryFn: createBoundQueryFn<WrapInResult<ResultType>>(engine),
        placeholderData: { result: mergedOptions.placeholderData },
        select: (data) => data?.result,
    })

    const mutationFn = async (data: ResultType) => {
        const mutation = queryCreators.setValues({
            namespace: mergedOptions.namespace,
            key: mergedOptions.key,
            global: mergedOptions.global,
            data,
        })
        try {
            return await engine.mutate(mutation)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // if namespace or key does not exist, create it
            if (error.details?.httpStatusCode === 404) {
                return await engine.mutate({ ...mutation, type: 'create' })
            }
            throw error
        }
    }
    const mutation = useMutation({
        mutationFn,
        onSettled: () => queryClient.invalidateQueries([query]),
    })
    return [queryResult, mutation] as const
}
