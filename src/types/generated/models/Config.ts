/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Config = {
    inclusionStrategy: Config.inclusionStrategy
    properties: Record<string, Record<string, any>>
}

export namespace Config {
    export enum inclusionStrategy {
        ALWAYS = 'ALWAYS',
        NON_NULL = 'NON_NULL',
        NON_EMPTY = 'NON_EMPTY',
    }
}
