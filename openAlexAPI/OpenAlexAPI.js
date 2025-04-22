require('dotenv').config(
    {
        path: (__dirname, '../.env'),
    }
)
class OpenAlexAPI {
    constructor() {
    }

    /**
     * Public Functions
     */


    /**
     * Static Values
     */
    static OPEN_ALEX_URL = "https://api.openalex.org/works/"



    /**
     * Private Functions
     */
    async _queryAPI(method, path, params) {
        const methodUpper = 'GET'
        const fixedPath = "blach"
        const resp = await fetch(path, {
            method: methodUpper,
            headers: {
                "mailto": process.env.OPEN_ALEX_EMAIL
            }
        })
        return resp
    }
}

module.exports = {
    OpenAlexAPI,
}