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
    compression: 'zip' | 'gz' | 'uncompressed'
    selected?: Set<string>
}
const getDownloadLink = (options: GetDownloadLinkOptions) => {
    const { baseUrl, download, filters, model, compression, sharing } = options
    const filterString =
        filters.length === 0
            ? ''
            : `filter=${filters.map(encodeURIComponent).join('&filter=')}`
    const downloadString = download ? 'download=true' : ''
    const metadataString =
        compression === 'uncompressed'
            ? 'metadata.json'
            : `metadata.json.${compression}`
    const objectString = `${model}=true`
    const sharingString = sharing ? 'includeSharing=true' : ''
    const selectedFilterString = options.selected?.size
        ? `filter=id:in:[${Array.from(options.selected)
              .map(encodeURIComponent)
              .join(',')}]`
        : ''

    return `${baseUrl}/api/${metadataString}?${objectString}&${downloadString}&${filterString}&${sharingString}&${selectedFilterString}`
}

type UseDownloadUrlOptions = {
    selectedModels: Set<string>
}

export const useDownloadUrl = ({ selectedModels }: UseDownloadUrlOptions) => {
    const section = useSchemaSectionHandleOrThrow()
    const { baseUrl } = useConfig()
    const {
        values: { compression, includeSharing, filter },
    } = useDownloadFormState()
    const { filter: filterParams } = useParamsForDataQuery()
    return getDownloadLink({
        baseUrl,
        download: true,
        filters: filter === 'all' ? [] : filterParams,
        model: section.namePlural,
        sharing: includeSharing,
        compression,
        selected: selectedModels,
    })
}
