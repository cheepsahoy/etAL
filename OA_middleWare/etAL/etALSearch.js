import OA_API from '../openAlexAPI/OpenAlexAPI'

const OpenAlexAPI = new OA_API('')

class deepSearchManager {
    constructor(initial) {
        this.searchTerm = initial
        this.page = 1
        this.lastResult = []
    }

    async nextPage() {
        const response = await OpenAlexAPI.deepSearchByQuerry(this.searchTerm, this.page)
        if (response.error) {
            console.log(response.error)
            return
        }
        if (response.results.length === 0) {
            console.log('Reached the end of search')
            return
        }
        this.lastResult = response.results
        this.page++
        return response.results
    }

    reset(newSearch = '') {
        this.searchTerm = newSearch
        this.page = 1
        this.lastResult = []
    }
}

async function autoComplete(input) {
    return await OpenAlexAPI.simpleSearchByName(input)
}

function _extractOpenAlexID(openAlex_URL) {
    const regex = /(W\d+)/gm
    const alexID = openAlex_URL.match(regex)
    return alexID[0]
}

export default {
    autoComplete,
    _extractOpenAlexID,
    deepSearchManager,
}
