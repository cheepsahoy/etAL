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
    const keys_citation_outgoing = Object.keys(citation_outgoing)

    const object_array = []
    for (const key of keys_citation_outgoing) {
        citation_outgoing[key].id = key
        object_array.push(citation_outgoing[key])
    }
    object_array.sort((a, b) => b.gravity - a.gravity)
    console.log(object_array[100])
}
run().then().catch()

