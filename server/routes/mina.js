
import config from '../config'
import {controller, get, post,required} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import {openidAndSessionKey} from '../wechat-lib/mina'
import User from '../database/schema/user'
@controller('/mina')
export class MinaController {

    @get('codeAndSessionKey')
    @required({query: ['code']})
    async getCodeAndSessionKey(ctx,next){
        let {code} = ctx.query
        let res = await openidAndSessionKey(code)
        ctx.body = {
            success: true,
            data: res
        }
    }

    @get('user')
    @required({query: ['code','userInfo']})
    async getUser(ctx,next){
        let {code,userInfo} = ctx.query
        let minaUser = await openidAndSessionKey(code)
        let user = await User.findOne({
            openid: {
                '$in': [minaUser.openid]
            }
        })
        if(!user){     
            let pc = new WXBizDataCrypt(minaUser.sessionKey)          
            let data = pc.decryptData(userInfo.encryptedData , userInfo.iv)          
            
            console.log('解密后 data: ', data)
            try {
                user = await User.findOne({openid: data.openid})
                if(!user){
                    let _userData = userInfo.userInfo
                    user = new User({
                        avatarUrl: _userData.avatarUrl,
                        nickname: _userData.nickname,
                        openid: [_userData.openid],
                        sex: _userData.gender,
                        country: _userData.country,
                        city: _userData.city,
                        province: _userData.province
                    })
                    await user.save()
                }
            }catch (err){
                return ctx.body = {
                    success: false,
                    err: err
                }
            }
        }
        ctx.body = {
            success: true,
            data: {
                nickname: user.nickname,
                avatarUrl: user.avatarUrl,
                sex: user.sex
            }
        }
    }
    @post('/login')
    @required({body: ['code','avatarUrl','nickName']})
    async login(ctx,next){
       let {code, avatarUrl, nickName} = ctx.request.body
        try {
            let {openid} = await openidAndSessionKey(code)
            let user = await User.findOne({openid: openid}).exec()
            if(!user){
                user = new User({
                    openid: [openid],
                    nickname: nickName,
                    avatarUrl
                })
                user = await user.save()
            }else {
                user.avatarUrl = avatarUrl
                user.nickname = nickname
                user = await user.save()
            }
            ctx.body = {
                success: true,
                data: {
                    nickname: nickname,
                    avatarUrl: avatarUrl
                }
            }
        }catch (err){
            ctx.body = {
                success: false,
                err: err
            }
        }
    }

}
