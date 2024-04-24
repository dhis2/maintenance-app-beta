import { useConfig } from '@dhis2/app-runtime'
import {
    useFilterQueryParams,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { useDownloadFormState } from './DownloadForm'

type GetDownloadLinkOptions = {
    baseUrl: string
    download?: boolean
    filters: readonly string[]
    model: string
    sharing?: boolean
    compression: 'zip' | 'gz' | 'uncompressed'
    selected?: Set<string>
}

const optionalQueryParam = (paramValue: string, condition: boolean) =>
    condition ? `&${paramValue}` : ''

export const getDownloadLink = (options: GetDownloadLinkOptions) => {
    const { baseUrl, download, filters, model, compression, sharing } = options
    const filterString = optionalQueryParam(
        `filter=${filters.map(encodeURIComponent).join('&filter=')}`,
        filters.length > 0
    )
    const downloadString = optionalQueryParam('download=true', !!download)
    const metadataString =
        compression === 'uncompressed'
            ? 'metadata.json'
            : `metadata.json.${compression}`
    const objectString = `${model}=true`
    const sharingString = optionalQueryParam('includeSharing=true', !!sharing)

    const selectedFilterString = optionalQueryParam(
        `filter=id:in:[${Array.from(options.selected || [])
            .map(encodeURIComponent)
            .join(',')}]`,
        !!options.selected?.size
    )

    return `${baseUrl}/api/${metadataString}?${objectString}${downloadString}${sharingString}${filterString}${selectedFilterString}`
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
    const filterParams = useFilterQueryParams()
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
