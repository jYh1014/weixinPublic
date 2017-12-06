
import {controller, get, post, required} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import api from '../api'
@controller('/admin')

export class AdminController {
    @post('login')
    @required({body: ['email','password']})
    async login(ctx,next){
        let {email,password} = ctx.request.body
        let data = await api.admin.login(email,password)
        let {user,match} = data
        if(match){
            ctx.session.user = {
                _id: user._id,
                email: user.email,
                role: user.role,
                nickname: user.nickname,
                avatarUrl: user.avatarUrl
            }
            return (ctx.body = {
                success: true,
                data: {
                    email: user.email,
                    nickname: user.nickname,
                    avatarUrl: user.avatarUrl
                }
            })
        }else {
            return (ctx.body = {
                success: true,
                err: '密码错误'
            })
        }
    }

    @post('logout')
    async logout(ctx,next){
        ctx.session = null
        return ctx.body = {success:true}
    }
    
    
}
