import { useConfig } from '@dhis2/app-runtime'
import { useFilterQueryParams } from '../../../lib'
import { DownloadFormValues, useDownloadFormState } from './DownloadForm'

type GetDownloadLinkOptions = {
    baseUrl: string
    filters: readonly string[]
    modelNamePlural: string
    sharing?: boolean
    compression: DownloadFormValues['compression']
}

export const getDownloadLink = (options: GetDownloadLinkOptions) => {
    const { baseUrl, filters, modelNamePlural, compression, sharing } = options

    const filterString =
        filters.length > 0
            ? `&filter=${filters.map(encodeURIComponent).join('&filter=')}`
            : ''

    const objectString = `${modelNamePlural}=true`
    const downloadString = 'download=true'
    const metadataString =
        compression === 'uncompressed'
            ? 'metadata.json'
            : `metadata.json.${compression}`

    const sharingString = sharing ? 'skipSharing=false' : 'skipSharing=true'

    return `${baseUrl}/api/${metadataString}?${objectString}&${downloadString}&${sharingString}${filterString}`
}

type UseDownloadUrlOptions = {
    selectedModels: Set<string>
    modelNamePlural: string
}

export const useDownloadUrl = ({
    selectedModels,
    modelNamePlural,
}: UseDownloadUrlOptions) => {
    const { baseUrl } = useConfig()
    const {
        values: { compression, includeSharing, filterType },
    } = useDownloadFormState()
    const filterParams = useFilterQueryParams()

    let resolvedFilters: string[] = []
    if (filterType === 'filters') {
        resolvedFilters = filterParams
    }
    if (filterType === 'selected' && selectedModels.size > 0) {
        resolvedFilters = [`id:in:[${Array.from(selectedModels).join(',')}]`]
    }

    return getDownloadLink({
        baseUrl,
        filters: resolvedFilters,
        modelNamePlural,
        sharing: includeSharing,
        compression,
    })
}
