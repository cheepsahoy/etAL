require('dotenv').config()
const OpenAlex = require('./openAlexAPI/OpenAlexAPI')

async function run() {
    let alex = new OpenAlex(process.env.OPEN_ALEX_EMAIL)
    
    let output = await alex.getSingleWork("10.1177/0001839214534186")
    console.log(output)
}
run().then().catch()