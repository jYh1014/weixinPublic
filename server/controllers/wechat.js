import api from '../api'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
import config from '../config'
export async function  signature(ctx,next) {
    let url = ctx.query.url
    if(!url){
        ctx.throw(404)
    }
    url = decodeURIComponent(url)
    let params = await api.wechat.getSignatureAsync(url)
    // console.log(params)
    ctx.body = {
        success: true,
        params: params
    }
}
export async function redirect(ctx,next){
    let target = config.SITE_ROOT_URL + '/oauth'
    let scope = 'snsapi_userinfo'
    let {visit,id} = ctx.query

    let params = id?`${visit}_${id}`: visit
    let url = api.wechat.getAuthorizeURL(scope,target,params)
    ctx.redirect(url)
}
export async function oauth(ctx,next){
    
    let url = ctx.query.url
    url = decodeURIComponent(url)
    let urlObj = urlParse(url)
    let params = queryParse(urlObj.query)
    
    let code = params.code
    let user = await api.wechat.getUserByCode(code)
    
    ctx.session.user = user

    ctx.body = {
        success:true,
        data: user
    }
}