import OA_API from '../openAlexAPI/OpenAlexAPI'
import dotenv from 'dotenv'
dotenv.config({
    path: '../../.env',
})

const OpenAlexAPI = new OA_API(process.env.OPEN_ALEX_EMAIL)

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

const autoComplete = async function (input) {
    return await OpenAlexAPI.simpleSearchByName(input)
}

export default {
    autoComplete,
    deepSearchManager,
}
