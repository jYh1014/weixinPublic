import _ from 'lodash'
import {resolve} from 'path'

let host = process.env.HOST || 'localhost'
let env = process.env.NODE_ENV || 'development'
let conf = require(resolve(__dirname,`./${env}.json`))

export default _.assign({
    env,host
},conf)