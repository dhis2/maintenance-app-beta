// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNotFoundError = (error: any): boolean => error?.status === 404
