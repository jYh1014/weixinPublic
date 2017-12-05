


import Router from 'koa-router'
import {controller, get, post} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import WikiHouse from '../database/schema/wikiHouse'

@controller('/wiki')

export class WechatController {
    @get('/houses')
    async getHouses(ctx,next){
        
        const houses = await WikiHouse.find({}).populate({
            path: 'swornMember.character',
            select: '_id name cname profile'
        }).exec()
        console.log(houses)
        ctx.body = {
            success: true,
            data: houses
        }
    }
    @get('/houses/:id')
    async getHouse(ctx,next){
        let { params } = ctx
        let { _id } = params
        if(!_id){
            return (ctx.body = {
                success: false,
                err: '_id is required'
            })
        }
        let house = await WikiHouse.findOne({
            _id: _id
        }).populate({
            path: 'swornMember.character',
            select: '_id name cname nmId'
        }).exec()
        ctx.body = {
            success: true,
            data: house
        }
    }
    
}
