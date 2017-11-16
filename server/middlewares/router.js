import Router from 'koa-router'
import sha1 from 'sha1'
import config from '../config'
export const router = app => {
    const router = new Router()
    router.get('/wechat-hear',(ctx,next) => {
        const { signature,nonce,timestamp,echostr} = ctx.query
        const token = config.wechat.token
        const str = [token,timestamp,nonce].sort().join('')
        const sha = sha1(str)
        // console.log(sha === signature)
        if(sha === signature){
            ctx.body = echostr
        }else{
            ctx.body = 'fail'
        }
        
    })
    
    app.use(router.routes())
    app.use(router.allowedMethods())
}