import {resolve} from 'path'
import R from 'ramda'
import {find} from 'lodash'
import { writeFileSync } from 'fs'

const characters = require(resolve(__dirname,'../../characters.json'))
const IMDbData = require(resolve(__dirname,'../../imdb.json'))

const findNameInAPI = item => {
    console.log(find(characters, {name: item.name}))
    return find(characters, {name: item.name})
    // characters.filter(i => {
    //     i.name == item.name
    // })
}
const findPlayedByInAPI = item => {
    return find(characters, i => {
        return i.playedBy.includes(item.playedBy)
    })
}
const validData = R.filter(
    i => findNameInAPI(i) && findPlayedByInAPI(i)
)

let IMDb = validData(IMDbData)
console.log(IMDb)
writeFileSync('./wikiCharacters.json',JSON.stringify(IMDb,null,2),'utf8')
