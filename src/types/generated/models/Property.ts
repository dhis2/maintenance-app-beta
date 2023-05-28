/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GistPreferences } from './GistPreferences'

export type Property = {
    analyticalObject: boolean
    apiEndpoint: string
    attribute: boolean
    cascade: string
    collection: boolean
    collectionName: string
    collectionWrapping: boolean
    constants: Array<string>
    /**
     * The actual type is unknown.
     * (Java type was: `class java.lang.Object`)
     */
    defaultValue: Record<string, any>
    description: string
    embeddedObject: boolean
    fieldName: string
    gistPreferences: GistPreferences
    href: string
    i18nTranslationKey: string
    identifiableObject: boolean
    inverseRole: string
    itemKlass: string
    itemPropertyType: Property.itemPropertyType
    klass: string
    length: number
    manyToMany: boolean
    manyToOne: boolean
    max: number
    min: number
    name: string
    nameableObject: boolean
    namespace: string
    oneToMany: boolean
    oneToOne: boolean
    ordered: boolean
    owner: boolean
    owningRole: string
    persisted: boolean
    propertyTransformer: boolean
    propertyType: Property.propertyType
    readable: boolean
    relativeApiEndpoint: string
    required: boolean
    simple: boolean
    translatable: boolean
    translationKey: string
    unique: boolean
    writable: boolean
}

export namespace Property {
    export enum itemPropertyType {
        IDENTIFIER = 'IDENTIFIER',
        TEXT = 'TEXT',
        NUMBER = 'NUMBER',
        INTEGER = 'INTEGER',
        BOOLEAN = 'BOOLEAN',
        USERNAME = 'USERNAME',
        EMAIL = 'EMAIL',
        PASSWORD = 'PASSWORD',
        URL = 'URL',
        DATE = 'DATE',
        PHONENUMBER = 'PHONENUMBER',
        GEOLOCATION = 'GEOLOCATION',
        COLOR = 'COLOR',
        CONSTANT = 'CONSTANT',
        COMPLEX = 'COMPLEX',
        COLLECTION = 'COLLECTION',
        REFERENCE = 'REFERENCE',
    }

    export enum propertyType {
        IDENTIFIER = 'IDENTIFIER',
        TEXT = 'TEXT',
        NUMBER = 'NUMBER',
        INTEGER = 'INTEGER',
        BOOLEAN = 'BOOLEAN',
        USERNAME = 'USERNAME',
        EMAIL = 'EMAIL',
        PASSWORD = 'PASSWORD',
        URL = 'URL',
        DATE = 'DATE',
        PHONENUMBER = 'PHONENUMBER',
        GEOLOCATION = 'GEOLOCATION',
        COLOR = 'COLOR',
        CONSTANT = 'CONSTANT',
        COMPLEX = 'COMPLEX',
        COLLECTION = 'COLLECTION',
        REFERENCE = 'REFERENCE',
    }
}
