


import Router from 'koa-router'
import {controller, get, post} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import WikiHouse from '../database/schema/wikiHouse'
import WikiCharacter from '../database/schema/wikiCharacter'
import * as api from '../api/wiki'
@controller('/wiki')

export class WechatController {
    @get('/houses')
    async getHouses(ctx,next){
       const data = await api.getHouses()
        
        ctx.body = {
            success: true,
            data: data
        }
    }
    @get('/houses/:_id')
    async getHouse(ctx,next){
    
        let { params } = ctx 
        let { _id } = params
        if(!_id){
            return (ctx.body = {
                success: false,
                err: '_id is required'
            })
        }
        const data = await api.getHouse(_id)
        ctx.body = {
            success: true,
            data: data
        }
    }

    @get('/characters')
    async getCharacters(ctx,next){
        let { limit = 20 } = ctx.query
        const data = await api.getCharacters(limit)
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
        console.log(_id)
        if(!_id){
            return (ctx.body = {
                success: false,
                err: '_id is required'
            })
        }
        const data = await api.getCharacter(_id)
        ctx.body = {
            success: true,
            data: data
        }
    }
    
}
