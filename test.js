require('dotenv').config()
const OpenAlex = require('./openAlexAPI/OpenAlexAPI')
const etAl = require('./etAL/utilities')

async function run() {
    let alex = new OpenAlex(process.env.OPEN_ALEX_EMAIL)
    
    //let output = await alex.getSingleWorkbyDOI("10.1002/9781119265771.ch10")

    //let etal = new etAl(output)

    let output = await alex.getCites("W2800811029")
    console.log(output)
}
run().then().catch()

