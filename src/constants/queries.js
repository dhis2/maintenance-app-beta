/**
 * @typedef {Object} QueryResource
 * @property {string} resource
 */

/**
 * @typedef {Object.<string, QueryResource>} Query
 */

/**
 * @type {Query} queries
 */
export const queries = {
    authorities: { resource: 'me/authorities' },
    systemSettings: { resource: 'systemSettings' },
}
