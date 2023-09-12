export interface JsonPatchOperation {
    op: 'add' | 'replace' | 'remove'
    path: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}
