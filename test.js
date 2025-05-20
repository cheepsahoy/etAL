require('dotenv').config()
const OpenAlex = require('./openAlexAPI/OpenAlexAPI')
const etAl = require('./etAL/utilities')
const fs = require('fs')
const citation_conversation = require('./testdata/testdata_citation_conversation.json')
const citation_outgoing = require('./testdata/testdata_citation_outgoing.json')

function writeFile(filepath, data) {
    try {
        fs.writeFileSync(filepath, data)
        console.log('Wrote file')
    } catch (error) {
        console.error(`Error writing to ${filepath}`, error)
    }
}

async function run() {
    const keys_citation_conversation = Object.keys(citation_conversation)
    const sorted_citation_conversation = []
    for (const key of keys_citation_conversation) {
        sorted_citation_conversation.push(citation_conversation[key])
    }
    sorted_citation_conversation.sort((a, b) => b.oracle_score - a.oracle_score)
    console.log(sorted_citation_conversation[6])
    /*
    const OpenAlexAPI = new OpenAlex(process.env.OPEN_ALEX_EMAIL)
    const etALAPI = new etAl()

    const originEssay = await OpenAlexAPI.getSingleWorkbyDOI("10.1080/00335638009383499")

    etALAPI.initialize(originEssay)
    await etALAPI.populateConversation()

    const citationConversation = JSON.stringify(etALAPI.citation_conversation, null, 2)
    const citationOutgoing = JSON.stringify(etALAPI.citations_outgoing, null, 2)
    writeFile('./testdata_citation_conversation.json', citationConversation)
    writeFile('./testdata_citation_outgoing.json', citationOutgoing)
    */
}
run().then().catch()

