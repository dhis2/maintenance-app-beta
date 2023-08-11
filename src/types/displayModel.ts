import { IdentifiableObject } from './generated'

export interface ModelReference extends IdentifiableObject {
    name?: string // gist endpoint returns translated name
    displayName?: string // other endpoints should use displayName
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isModelReference = (model?: any): model is ModelReference => {
    return !!model && !!model.id && (!!model.name || !!model.displayName)
}
