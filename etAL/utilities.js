require('dotenv').config()
const OpenAlex = require('../openAlexAPI/OpenAlexAPI')
const OpenAlexAPI = new OpenAlex(process.env.OPEN_ALEX_EMAIL)

class etalWrapper {
    /**
     * @param {OA_WorkObject} initialGetCite
     */
    constructor(initialGetCite) {
        this.citation_conversation = {}
        this.citations_outgoing = {}
        this.centralCitationID = initialGetCite.id
    }
}