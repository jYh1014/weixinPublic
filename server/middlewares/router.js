import Router from 'koa-router'
import sha1 from 'sha1'
import config from '../config'
import wechatMiddle from '../wechat-lib/middleware'
// import  '../wechat'
import reply from '../wechat/reply'
export const router = app => {
    const router = new Router()
    router.all('/wechat-hear',wechatMiddle(config.wechat,reply))
    
    app.use(router.routes())
    app.use(router.allowedMethods())
}