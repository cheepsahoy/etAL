require('dotenv').config()
const OpenAlex = require('../openAlexAPI/OpenAlexAPI')
const OpenAlexAPI = new OpenAlex(process.env.OPEN_ALEX_EMAIL)

class etalWrapper {
    /**
     * @param {OA_WorkObject} initialGetCite
     */
    constructor(initialGetCite) {
        this.centralCitationID = OpenAlexAPI._extractOpenAlexID(initialGetCite.id)
        this.citation_conversation = {}
        this.citation_conversation[this.centralCitationID] = {
            "doi": initialGetCite.doi,
            "title": initialGetCite.title,
            "pub_date": initialGetCite.publication_date,
            "citation": "",
            "authors": {},
            "outgoing_cites": {},
            "incoming_cites": {},
            "abstract": "",
            "centrality_score": 0
        },
        this.citations_outgoing = {}
        //need to go through authorship object and 
        for (const authorObj of initialGetCite.authorships) {
            this.citation_conversation[this.centralCitationID].authors[authorObj.author.display_name] = 1
        }
        //need to go through outgoing cites, ammend citations_outgoing and 
        for (const citationURL of initialGetCite.referenced_works) {
            let alexID = OpenAlexAPI._extractOpenAlexID(citationURL)
            this.citations_outgoing[alexID] = {
                "doi": "",
                "title": "",
                "pub_date": "",
                "citation": "",
                "authors": {},
                "outgoing_cites": {},
                "incoming_cites": {},
                "abstract": ""
            }
            this.citations_outgoing[alexID].incoming_cites[this.centralCitationID] = 1
            this.citation_conversation[this.centralCitationID].outgoing_cites[alexID] = 1
        }
    }
    
    /**
     * 
     * @param {string} centralConversation OpenAlexID 
     * @returns {Array}
     */
    async populateConversation(centralConversation = this.centralCitationID) {
        const conversationalists = await OpenAlexAPI.getCites(centralConversation)

        //We populate citation Conversation w/ key-values and identites of 
        for (const artifact of conversationalists) {
            let alexID = OpenAlexAPI._extractOpenAlexID(artifact.id)
            this.citation_conversation[alexID] = {
                "doi": artifact.doi,
                "title": artifact.title,
                "pub_date": artifact.publication_date,
                "citation": "",
                "authors": {},
                "outgoing_cites": {},
                "incoming_cites": {},
                "abstract": "",
                "centrality_score": 0
            }
            //we need to extract the authors and assign their values to the conversation entry
            for (const authorObj of artifact.authorships) {
                this.citation_conversation[alexID].authors[authorObj.author.display_name] = 1
            }
        }
        //After this initial pass, we need to go over the list again and, using their outgoing citations, establish webs of connections [who cites who?]
        for (const artifact of conversationalists) {

        }
    }

    async identifyOutgoingCitations() {

    }

    calculateCentralityScore() {
        
    }
}

module.exports = etalWrapper