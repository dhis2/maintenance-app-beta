// eslint-disable-next-line @typescript-eslint/no-var-requires
const { config } = require('@dhis2/cli-style')

module.exports = {
    ...require(config.prettier),
}
