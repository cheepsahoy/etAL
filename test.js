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
    const keys_conversation_array = Object.keys(citation_conversation)

    const object_array = []
    for (const key of keys_conversation_array) {
        citation_conversation[key].id = key
        object_array.push(citation_conversation[key])
    }
    object_array.sort((a, b) => b.centrality_score - a.centrality_score)
    console.log(object_array[6])
}
run().then().catch()

