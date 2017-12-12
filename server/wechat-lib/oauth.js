import request from 'request-promise'

const base = 'https://api.weixin.qq.com/sns/'
const api = {
    authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
    accessToken: base + 'oauth2/access_token?',
    userInfo: base + 'userinfo?'
}

export default class WechatOAuth {
    constructor(opts){
        
        this.appID = opts.appID
        this.appSecret = opts.appSecret
    }
    async request(options) {
        
        options = Object.assign({},options,{json:true})
        const response = await request(options)
        return response
    }
     getAuthorizeURL(scope = 'snsapi_userinfo',target,state){
         
        let url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect `
        return url
    }
    async fetchAccessToken(code){    
          let url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
          let data = await this.request({url: url})
          return data
    }
    async getUserInfo(token,openID,lang='zh_CN'){
        let url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=${lang}`
        let data = await this.request({url: url})
        return data
    }
}