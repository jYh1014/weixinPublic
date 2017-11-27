import * as api from '../api/wechat'

export async function  signature(ctx,next) {
    let url = ctx.query.url
    if(!url){
        ctx.throw(404)
    }
    let params = await api.getSignatureAsync(url)
    // console.log(params)
    ctx.body = {
        success: true,
        params: params
    }
}