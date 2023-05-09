import type {
    AttributeValue,
    User,
    UserAccess,
    UserGroupAccess,
} from "./models";

export type Id = string;

export interface ModelReference {
    id: Id;
}

export interface ModelBase {
    access: Access;
    attributeValues: AttributeValue[];
    code: string;
    created: string;
    createdBy: User;
    displayName: string;
    externalAccess: boolean;
    favorite: boolean;
    favorites: string[];
    href: string;
    id: string;
    lastUpdated: string;
    lastUpdatedBy: User;
    name: string;
    publicAccess: string;
    sharing: Sharing;
    translations: Translation[];
    user: User;
    userAccesses: UserAccess[];
    userGroupAccesses: UserGroupAccess[];
}

/* "Complex" property-types that are referenced from models */
export interface Access {
    delete: boolean;
    externalize: boolean;
    manage: boolean;
    read: boolean;
    update: boolean;
    write: boolean;
}

export interface AccessData {
    read: boolean;
    write: boolean;
}
export interface AccessWithData extends Access {
    data: Access;
}

export type Coordinates = [number, number];

export interface GeomtryPoint {
    type: "Point";
    coordinates: Coordinates;
}
export interface GeometryPolygon {
    type: "Polygon";
    coordinates: Array<Coordinates[]>;
}
export interface GeometryMultiPolygon {
    type: "MultiPolygon";
    coordinates: Array<Array<Coordinates[]>>;
}
export type Geometry = GeomtryPoint | GeometryPolygon | GeometryMultiPolygon;

export interface ProgramOwner {
    ownerOrgUnit: Id;
    program: Id;
    trackedEntityInstance: Id;
}

export interface SharingMember {
    id: Id;
    access: Access;
    displayName: string;
}

export interface Sharing {
    owner: Id;
    public: Access;
    users: Record<Id, SharingMember>;
    userGroups: Record<Id, SharingMember>;
    external: boolean;
}

export type Translation = {
    property: string;
    locale: string;
    value: string;
};

export type ReportingParams = {
    reportingPeriod: boolean;
    grandParentOrganisationUnit: boolean;
    parentOrganisationUnit: boolean;
    organisationUnit: boolean;
};

export interface ObjectStyle {
    color: string;
    icon: string;
}
