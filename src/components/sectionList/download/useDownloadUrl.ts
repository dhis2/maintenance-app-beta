import { useConfig } from '@dhis2/app-runtime'
import {
    useParamsForDataQuery,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { useDownloadFormState } from './DownloadForm'

const encodeUriComponents = (params: string[]) =>
    params.map((param) => encodeURIComponent(param))

type GetDownloadLinkOptions = {
    baseUrl: string
    download?: boolean
    filters: string[]
    model: string
    sharing?: boolean
    compression: 'zip' | 'gzip' | 'uncompressed'
}
const getDownloadLink = (options: GetDownloadLinkOptions) => {
    const { baseUrl, download, filters, model, compression, sharing } = options
    const filterString =
        filters.length === 0
            ? ''
            : `filter=${encodeUriComponents(filters).join('&filter=')}`
    const downloadString = download ? 'download=true' : ''
    const metadataString =
        compression === 'uncompressed'
            ? 'metadata.json'
            : `metadata.json.${compression}`
    const objectString = `${model}=true`
    const sharingString = sharing ? 'includeSharing=true' : ''
    return `${baseUrl}/api/${metadataString}?${objectString}&${downloadString}&${filterString}&${sharingString}`
}
export const useDownloadUrl = (
    { downloadParam }: { downloadParam: boolean } = { downloadParam: true }
) => {
    const section = useSchemaSectionHandleOrThrow()
    const { baseUrl } = useConfig()
    const {
        values: { compression, includeSharing, filter },
    } = useDownloadFormState()
    const { filter: filterParams } = useParamsForDataQuery()
    return getDownloadLink({
        baseUrl,
        download: downloadParam,
        filters: filter === 'all' ? [] : filterParams,
        model: section.namePlural,
        sharing: includeSharing,
        compression,
    })
}
