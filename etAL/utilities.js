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
            "id": this.centralCitationID,
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
        //need to go through authorship object and extract
        for (const authorObj of initialGetCite.authorships) {
            this.citation_conversation[this.centralCitationID].authors[authorObj.author.display_name] = 1
        }
        //need to go through outgoing cites, ammend citations_outgoing and citation_conversation
        for (const citationURL of initialGetCite.referenced_works) {
            let alexID = OpenAlexAPI._extractOpenAlexID(citationURL)
            this.citations_outgoing[alexID] = {
                "doi": "",
                "id": alexID,
                "title": "",
                "pub_date": "",
                "citation": "",
                "authors": {},
                "outgoing_cites": {},
                "incoming_cites": {},
                "abstract": "",
                "gravity": 1,
            }
            this.citations_outgoing[alexID].incoming_cites[this.centralCitationID] = 1
            this.citation_conversation[this.centralCitationID].outgoing_cites[alexID] = 1
        }
    }
    
    /**
     * 
     * @param {string} centralConversation OpenAlexID 
     * @returns {Promise}
     */
    async populateConversation(centralConversation = this.centralCitationID) {
        const conversationalists = await OpenAlexAPI.getCites(centralConversation)

        //We populate citation_conversation w/ key-values and identites 
        for (const artifact of conversationalists) {
            let artifactID = OpenAlexAPI._extractOpenAlexID(artifact.id)
            this.citation_conversation[artifactID] = {
                "doi": artifact.doi,
                "id": artifactID,
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
                this.citation_conversation[artifactID].authors[authorObj.author.display_name] = 1
            }
        }
        //After this initial pass, we need to go over the list again and, using their outgoing citations, establish webs of connections [who cites who?]
        for (const artifact of conversationalists) {
            const artifactID = OpenAlexAPI._extractOpenAlexID(artifact.id)
            for (const workURL of artifact.referenced_works) {
                const outgoingAlexID = OpenAlexAPI._extractOpenAlexID(workURL)

                //first: identify this as 'outgoing' for the initial artifact
                this.citation_conversation[artifactID].outgoing_cites[outgoingAlexID] = 1

                //Now we check to see if the out-going cite is part of the origional get-cite
                if (this.citation_conversation[outgoingAlexID]) {
                    //we identify the artifactID as an INCOMING for the out-going cite,
                    this.citation_conversation[outgoingAlexID].incoming_cites[artifactID] = 1

                    //this increases its centrality score
                    this.citation_conversation[outgoingAlexID].centrality_score += 1

                    //if it isn't in the central conversation, then it belongs in outgoing_cites
                } else if (this.citations_outgoing[outgoingAlexID]) {
                    //if it already exists, we increase its gravity and ammend its incoming cites
                    this.citations_outgoing[outgoingAlexID].gravity += 1

                    this.citations_outgoing[outgoingAlexID].incoming_cites[artifactID] = 1
                } else {
                    //otherwise, we need to create the entry
                    this.citations_outgoing[outgoingAlexID] = {
                        "doi": "",
                        "id": outgoingAlexID,
                        "title": "",
                        "pub_date": "",
                        "citation": "",
                        "authors": {},
                        "outgoing_cites": {},
                        "incoming_cites": {
                            [artifactID]: 1,
                        },
                        "abstract": "",
                        "gravity": 1,
                    }
                }
            }
        }
        //Now we create a sorted array for citation_outgoing using 'gravity' as a measurement, we save it to the instance
        const keys_citation_outgoing = Object.keys(this.citations_outgoing)
        this.sorted_citations_outgoing = []
        for (const key of keys_citation_outgoing) {
            sorted_citations_outgoing.push(this.citations_outgoing[key])
        }
        this.sorted_citations_outgoing.sort((a, b) => b.gravity - a.gravity)
    }

    async identifyOutgoingCitations() {
        //this should be dynamic, the use will 'click through' increasing order to find the most common out-going citations
        const outgoingCitationArray = []
        for (const alexID in this.citations_outgoing) {
            outgoingCitationArray.push(alexID)
        }

        const identifiedCitations = await OpenAlexAPI.getMultiWorks(outgoingCitationArray)
        for (const citation of identifiedCitations) {
            const alexID = OpenAlexAPI._extractOpenAlexID(citation.id)
            this.citations_outgoing[alexID].doi = citation.doi
            this.citations_outgoing[alexID].title = citation.title
            this.citations_outgoing[alexID].pub_date = citation.publication_date
            //extract author data
            for (const authorObj of citation.authorships) {
                this.citations_outgoing[alexID].authors[authorObj.author.display_name] = 1
            }
        }
    }

    async compareOutgoing() {
        //this function will look at a single author's reference page and highlight all other 'in-conversation' essays that share its 'outgoing' citations
    }

}

module.exports = etalWrapper