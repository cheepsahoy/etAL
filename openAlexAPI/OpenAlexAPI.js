
class OpenAlexAPI {
    #api_email
    #api_token

    constructor(your_email, your_token = '') {
        this.#api_email = your_email
        this.#api_token = your_token
    }

    //-------------Public Functions-----------------
    //note we can request mulitple works with the pipe symbol '|', see
    //https://blog.ourresearch.org/fetch-multiple-dois-in-one-openalex-api-request/ 
    //max 50 w/ single API request
    //author returns must use the open-alex ID associated with the 


    //-------------Static Values-----------------
    static OPEN_ALEX_URL = "https://api.openalex.org/"
    static OPEN_ALEX_WORKS_URI = "works/"
    static OPEN_ALEX_AUTHORS_URI = "authors/"
    static OPEN_ALEX_DOI_URL = "https://doi.org/"

    

    //-------------Private Functions------------------
    /**
     * 
     * @param {string} method 
     * @param {string} path 
     * @param {object} params 
     * @returns {Promise}
     */
    async _queryAPI(method, path, params = '') {
        const methodUpper = method.toUpperCase()
        const fixedPath = OpenAlexAPI.OPEN_ALEX_URL + path

        let payload = {
            "method": methodUpper,
            "headers": {
                "User-Agent": `mailto:${this.#api_email}`
            }
        }

        if (this.#api_token) {
            payload.headers.api_key = this.#api_token
        }

        if (params !== '' && methodUpper == "POST") {
            payload.body = JSON.stringify(params)
        }

        if (params !== '' && methodUpper == "GET") {

        }

        const resp = await fetch(fixedPath, payload)
        if (!resp.ok) {
            throw new Error(`API error: ${resp.status} ${resp.statusText}`)
        }
        return resp
    }

    async _encodeParams(params) {
        let encodedString = '?'

    }
}

module.exports = {
    OpenAlexAPI,
}