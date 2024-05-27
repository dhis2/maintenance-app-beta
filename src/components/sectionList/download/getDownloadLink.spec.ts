import { getDownloadLink } from './useDownloadUrl'

describe('getDownloadLink', () => {
    // Define the options for testing
    const baseOptions = {
        baseUrl: 'http://localhost:8080',
        filters: [],
        modelNamePlural: 'dataElements',
        compression: 'zip',
        sharing: true,
    } as const

    it('should should return the correct URL', () => {
        const result = getDownloadLink(baseOptions)
        expect(result).toBe(
            'http://localhost:8080/api/metadata.json.zip?dataElements=true&download=true&skipSharing=false'
        )
    })

    it('should return the correct URL with filters', () => {
        const filters = ['domainType:eq:AGGREGATE', 'valueType:eq:NUMBER']
        const result = getDownloadLink({ ...baseOptions, filters })
        expect(result).toBe(
            'http://localhost:8080/api/metadata.json.zip?dataElements=true&download=true&skipSharing=false&filter=domainType%3Aeq%3AAGGREGATE&filter=valueType%3Aeq%3ANUMBER'
        )
    })

    it('should return the correct URL with no compression', () => {
        const result = getDownloadLink({
            ...baseOptions,
            compression: 'uncompressed',
        })
        expect(result).toBe(
            'http://localhost:8080/api/metadata.json?dataElements=true&download=true&skipSharing=false'
        )
    })

    it('should return the correct URL with selected models', () => {
        const selectedFilter = [`id:in:[id1,id2]`]
        const result = getDownloadLink({
            ...baseOptions,
            filters: selectedFilter,
        })
        expect(result).toBe(
            'http://localhost:8080/api/metadata.json.zip?dataElements=true&download=true&skipSharing=false&filter=id%3Ain%3A%5Bid1%2Cid2%5D'
        )
    })
})
