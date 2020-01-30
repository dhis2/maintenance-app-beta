export const createTestNames = (...names) =>
    names.map(name => `datatest-dhis2-maintenance-${name}`).join(' ')
