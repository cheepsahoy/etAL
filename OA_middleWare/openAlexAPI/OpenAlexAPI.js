class OA_API {
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

    /**
     *
     * @param {string} searchQuerry
     * @returns {Promise<OA_WorkSearch}
     */
    async simpleSearchByName(searchQuerry) {
        let searchPath = 'works?search='
        let lowerSearch = searchQuerry.toLowerCase()
        let searchParam = encodeURI(lowerSearch)

        let resp = await this._queryAPI('GET', searchPath + searchParam)
        return resp
    }

    async deepSearchByQuerry(searchQuerry, page = 1) {
        let initialPatth = 'works?search='
        let lowerSearch = searchQuerry.toLowerCase()
        let encodedSearch = encodeURI(lowerSearch)
        let finalPath = initialPatth + encodedSearch + '&per-page=100&page=' + page

        const resp = await this._queryAPI('GET', finalPath)
        return resp
    }

    /**
     *
     * @param {string} doi
     * @returns {Promise<OA_WorkObject}
     */
    async getSingleWorkbyDOI(doi) {
        let doiURL = OA_API.OPEN_ALEX_DOI_URL + doi
        let resp = await this._queryAPI('GET', 'works/' + doiURL)
        return resp
    }

    /**
     *
     * @param {array} alexIDArray
     * @returns {Promise<OA_WorkObject[]}
     */
    async getMultiWorks(alexIDArray) {
        let finalProduct = []
        let miniBuilder = []
        for (const alexID of alexIDArray) {
            if (miniBuilder.length === 50) {
                let pathConjoin = miniBuilder.join('|')
                let finalPath = 'works?per-page=100&filter=openalex:' + pathConjoin
                let resp = await this._queryAPI('GET', finalPath)
                let results = resp.results
                finalProduct = finalProduct.concat(results)
                miniBuilder = []
            }
            miniBuilder.push(alexID)
        }

        if (miniBuilder.length > 0) {
            let pathConjoin = miniBuilder.join('|')
            let finalPath = 'works?per-page=100&filter=openalex:' + pathConjoin
            let resp = await this._queryAPI('GET', finalPath)
            let results = resp.results
            finalProduct = finalProduct.concat(results)
            miniBuilder = []
        }

        return finalProduct
    }

    /**
     *
     * @param {*} alexID
     * @returns {Promise<OA_WorkObject[]}
     */
    async getCites(alexID) {
        let paramObj = {}
        paramObj[alexID] = 1
        paramObj['&cursor='] = '*'

        let fullCites = []
        let path = 'works?per-page=100&filter=cites:'

        let resp = await this._queryAPI('GET', path, paramObj)
        paramObj['&cursor='] = resp.meta.next_cursor
        fullCites = fullCites.concat(resp.results)

        while (resp.meta.next_cursor && resp.results.length) {
            resp = await this._queryAPI('GET', path, paramObj)
            paramObj['&cursor='] = resp.meta.next_cursor
            fullCites = fullCites.concat(resp.results)
        }
        return fullCites
    }

    //-------------Static Values-----------------
    static OPEN_ALEX_URL = 'https://api.openalex.org/'
    static OPEN_ALEX_DOI_URL = 'https://doi.org/'

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
        let fixedPath = OA_API.OPEN_ALEX_URL + path

        let payload = {
            method: methodUpper,
            headers: {
                'User-Agent': `mailto:${this.#api_email}`,
            },
        }

        if (this.#api_token) {
            payload.headers.api_key = this.#api_token
        }

        if (params !== '' && methodUpper == 'POST') {
            payload.body = JSON.stringify(params)
        }

        if (params !== '' && methodUpper == 'GET') {
            let pathAdd = ''
            for (const key in params) {
                pathAdd += key
                if (key === '&cursor=') {
                    pathAdd += params[key]
                }
            }
            fixedPath = fixedPath += pathAdd
            fixedPath = encodeURI(fixedPath)
        }

        const resp = await fetch(fixedPath, payload)
        if (!resp.ok) {
            throw new Error(`API error: ${resp.status} ${resp.statusText}`)
        }
        return resp.json()
    }

    /**
     *
     * @param {string} openAlex_URL
     * @returns {string} this is JUST the ID# of the openalex ID
     */
    _extractOpenAlexID(openAlex_URL) {
        const regex = /(W\d+)/gm
        const alexID = openAlex_URL.match(regex)
        return alexID[0]
    }
}

export default OA_API
