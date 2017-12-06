
import {controller, get, post,del,put} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import api from '../api'
import xss from 'xss'
import R from 'ramda'
import {uptoken} from '../libs/qiniu'
@controller('/qiniu')

export class QiniuController {

    @get('token')
    async qiniuToken(ctx,next){
        let key = ctx.query.key
        let token = uptoken(key)
       
        ctx.body = {
            success: true,
            token: token
        }
    }
    
}
