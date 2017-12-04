import mongoose from 'mongoose'
import config from '../config'
import fs from 'fs'
import R from 'ramda'
import { resolve } from 'path'
import WikiCharacters from '../database/schema/wikiCharacter'
import WikiHouses from '../database/schema/wikiHouse'
// console.log(WikiCharacters)
const models = resolve(__dirname,'../database/schema')

// fs.readdirSync(models)
// .filter(file => ~file.search(/^[^\.].*js/))
// .forEach(file =>require(resolve(models,file)))
let wikiCharacters = require(resolve(__dirname, '../../finalCharacters.json'))
let wikiHouses = require(resolve(__dirname, '../../completeHouses.json'))
const formData = R.map(i => {
    i._id = i.nmId
    return i
})
wikiCharacters = formData(wikiCharacters)
export const database = () => {
    mongoose.set('debug',true)
    mongoose.connect(config.db)
    mongoose.connection.on('disconnect',() => {
        mongoose.connect(config.db)
    })
    mongoose.connection.on('error',(err) => {
        console.log(err)
    })
    mongoose.connection.on('open',async () => {
        console.log('connetion db')
        let existWikiCharacters = await WikiCharacters.find({}).exec()
        let existWikiHouses = await WikiHouses.find({}).exec()
        console.log(existWikiCharacters)
        if(existWikiCharacters.length === 0){
            console.log(12)
            WikiCharacters.insertMany(wikiCharacters)
        }
        if(existWikiHouses.length === 0){
            WikiHouses.insertMany(wikiHouses)
        }
    })

}