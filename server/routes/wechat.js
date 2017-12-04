


import Router from 'koa-router'
import sha1 from 'sha1'
import config from '../config'
import {resolve} from 'path'
import wechatMiddle from '../wechat-lib/middleware'
import reply from '../wechat/reply'
import {getWechat} from '../wechat'
import menu from '../wechat/menu'
import {controller, get, post} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
let client = getWechat() 

@controller('')

export class WechatController {
    @get('/wechat-hear')
    async wechatHear(ctx,next){
        const middle = wechatMiddle(config.wechat,reply)
        const body = await middle(ctx,next)
        ctx.body = body
    }

    @post('/wechat-hear')
    async wechatHear(ctx,next){
        const middle = wechatMiddle(config.wechat,reply)
        const body = await middle(ctx,next)
        ctx.body = body
    }

    @get('/wechat-redirect')
    async wechatRedirect(ctx,next){
        await redirect(ctx,next)
    }
    @get('/wechat-signature')
    async wechatSignature(ctx,next){
        await signature(ctx,next)
    }

    @get('/wechat-oauth')
    async wechatOAuth(ctx,next){
        await oauth(ctx,next)
    }
}
