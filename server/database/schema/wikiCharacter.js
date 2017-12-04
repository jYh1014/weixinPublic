const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const wikiCharacterSchema = new mongoose.Schema({
    _id:String,
    name: String,
    cname: String,
    nmId:String,
    chId:String,
    profile: String,
    playedBy: String,
    wikiId: Number,
    sections:Mixed,
    intro:[String],
    images:[String],
    meta:{
        createdAt:{
            type:Date,
            default:Date.now()
        },
        updatedAt:{
            type:Date,
            default:Date.now()
        }
    }
})
wikiCharacterSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    }else{
        this.meta.updatedAt = Date.now()
    }
    next()
})

const WikiCharacter = mongoose.model('WikiCharacter',wikiCharacterSchema)
export default WikiCharacter