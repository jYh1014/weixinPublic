


import Router from 'koa-router'
import {controller, get, post} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import WikiHouse from '../database/schema/wikiHouse'
import WikiCharacter from '../database/schema/wikiCharacter'



 
    export async function getHouses(){
        
        const data = await WikiHouse.find({}).populate({
            path: 'swornMembers.character',
            select: '_id name cname profile'
        }).exec()
        
        return data
    }
 
    export async function getHouse(_id){
    
        
        let data = await WikiHouse.findById({
            _id: _id
        }).populate({
            path: 'swornMembers.character',
            select: '_id name profile cname nmId'
        }).exec()
       
        return data
    }


    export async function getCharacters(limit = 20){
       
        const data = await WikiCharacter.find({})
        .limit(Number(limit)).exec()
        
        return data
    }

    export async function getCharacter(_id){
      console.log(_id)
        let data = await WikiCharacter.findOne({
            _id: _id
        }).exec()
        return data
    }
    
