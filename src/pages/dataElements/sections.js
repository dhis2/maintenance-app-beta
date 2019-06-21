export const sections = {
    dataElements: {
        path: '/list/dataElementSection/dataElement',
        name: 'Data elements',
        permissions: [
            'F_DATAELEMENT_PRIVATE_ADD',
            'F_DATAELEMENT_PUBLIC_ADD',
            'F_DATAELEMENT_DELETE',
        ],
    },
    dataElementGroup: {
        path: '/list/dataElementSection/dataElementGroup',
        name: 'Data element group',
        permissions: [
            'F_DATAELEMENTGROUP_PRIVATE_ADD',
            'F_DATAELEMENTGROUP_PUBLIC_ADD',
            'F_DATAELEMENTGROUP_DELETE',
        ],
    },
    dataElementGroupSet: {
        path: '/list/dataElementSection/dataElementGroupSet',
        name: 'Data element group set',
        permissions: [
            'F_DATAELEMENTGROUPSET_PRIVATE_ADD',
            'F_DATAELEMENTGROUPSET_PUBLIC_ADD',
            'F_DATAELEMENTGROUPSET_DELETE',
        ],
    },
}
