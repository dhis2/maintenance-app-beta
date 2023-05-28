/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Property } from './Property'

export type Node = {
    children: Array<Node>
    collection: boolean
    comment: string
    complex: boolean
    metadata: boolean
    name: string
    namespace: string
    order: number
    parent: Node
    property: Property
    simple: boolean
    type: Node.type
    unorderedChildren: Array<Node>
}

export namespace Node {
    export enum type {
        SIMPLE = 'SIMPLE',
        COMPLEX = 'COMPLEX',
        COLLECTION = 'COLLECTION',
    }
}
