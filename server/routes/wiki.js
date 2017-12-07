


import {controller, get, post} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import WikiHouse from '../database/schema/wikiHouse'
import WikiCharacter from '../database/schema/wikiCharacter'
import api from '../api'
@controller('/wiki')

export class WechatController {
    @get('/houses')
    async getHouses(ctx,next){
       const data = await api.wiki.getHouses()
        
        ctx.body = {
            success: true,
            data: data
        }
    }
    @get('/houses/:id')
    async getHouse(ctx,next){
    
        let { params } = ctx 
        let { id } = params
        if(!id){
            return ctx.body = {
                success: false,
                err: '_id is required'
            }
        }
        const data = await api.wiki.getHouse(id)
        ctx.body = {
            success: true,
            data: data
        }
    }

    @get('/characters')
    async getCharacters(ctx,next){
        let { limit = 20 } = ctx.query
        const data = await api.wiki.getCharacters(limit)
        // console.log(data)
        ctx.body = {
            success: true,
            data: data
        }
    }
    @get('/characters/:_id')
    async getCharacter(ctx,next){
        let { params } = ctx
        let { _id } = params
       
        if(!_id){
            return (ctx.body = {
                success: false,
                err: '_id is required'
            })
        }
        const data = await api.wiki.getCharacter(_id)
        ctx.body = {
            success: true,
            data: data
        }
    }
    
}
