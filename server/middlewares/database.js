import mongoose from 'mongoose'
import config from '../config'
import fs from 'fs'
import R from 'ramda'
import { resolve } from 'path'
import WikiCharacters from '../database/schema/wikiCharacter'
import WikiHouses from '../database/schema/wikiHouse'
import User from '../database/schema/user'
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
export const database = (app) => {
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
        if(existWikiCharacters.length === 0){
           
            WikiCharacters.insertMany(wikiCharacters)
        }
        if(existWikiHouses.length === 0){
            WikiHouses.insertMany(wikiHouses)
        }
        let user = await User.findOne({
            email: '3200371428@qq.com',
            
        })
        if(!user){
            console.log('写入admin')
            user = new User({
                email: '3200371428@qq.com',
                password: '123456',
                role: 'admin'
            })
            await user.save()
        }
    })

}