require('dotenv').config()
const OpenAlex = require('../openAlexAPI/OpenAlexAPI')
const OpenAlexAPI = new OpenAlex(process.env.OPEN_ALEX_EMAIL)

class etalWrapper {
    /**
     * @param {OA_WorkObject} initialGetCite
     */
    constructor(initialGetCite) {
        this.citation_conversation = {}
        this.citation_conversation[initialGetCite.id] = {
            "doi": initialGetCite.doi,
            "title": initialGetCite.title,
            "pub_date": initialGetCite.publication_date,
            "publication": initialGetCite.primary_location.source.display_name,
            "authors": [],
            "outgoing_cites": {},
            "incoming_cites": {},
            "abstract": "",
            "centrality_score": 0
        },
        this.citations_outgoing = {}
        this.centralCitationID = initialGetCite.id
        //need to go through authorship object and 
        for (const authorObj of initialGetCite.authorships) {
            this.citation_conversation[initialGetCite.id].authors.push(authorObj.author)
        }
        //need to go through outgoing cites, ammend citations_outgoing and 
        for (const citationURL of initialGetCite.referenced_works) {
            let alexID = OpenAlexAPI._extractOpenAlexID(citationURL)
            this.citations_outgoing[alexID] = {
                "doi": "",
                "title": "",
                "pub_date": "",
                "publication": "",
                "authors": "",
                "outgoing_cites": {},
                "incoming_cites": {},
                "abstract": ""
            }
            this.citations_outgoing[alexID].incoming_cites[initialGetCite.id] = 1
            this.citation_conversation[initialGetCite.id].outgoing_cites[alexID] = 1
        }
    }
}

module.exports = etalWrapper