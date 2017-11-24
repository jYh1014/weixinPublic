import Router from 'koa-router'
import sha1 from 'sha1'
import config from '../config'
import {resolve} from 'path'
import wechatMiddle from '../wechat-lib/middleware'
// import  '../wechat'
import reply from '../wechat/reply'
import {getWechat} from '../wechat'
let client = getWechat() 
export const router = app => {
    const router = new Router()
    router.all('/wechat-hear',wechatMiddle(config.wechat,reply))
    router.get('/upload',async (ctx,next) => {
           
        // let news = {
        //     "articles":[{
        //         "title": 'pipi',
                
        //         "thumb_media_id": 'vaS5OwsNqZWzwM2qOmQ6W9Uh4LC2oDVw3zGWc7TVkOk',
        
        //         "author": 'jyy',
        
        //         "digest": 'none',
        
        //         "show_cover_pic": 0,
        
        //         "content": 'none',
        
        //         "content_source_url": 'http://baidu.com'
        //     }]
        // }
        let userList = [ {openid:'obig21CB1xZuq31l5lmuIC1r1D2g',lang:'zh_CN'} ]
        // let data = await client.handle('batchTag',['obig21CB1xZuq31l5lmuIC1r1D2g'],100)
        let data = await client.handle('getTagList','obig21CB1xZuq31l5lmuIC1r1D2g')
        console.log(data)
    })
    
    app.use(router.routes())
    app.use(router.allowedMethods())
}