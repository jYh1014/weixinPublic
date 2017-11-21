import request from 'request-promise'
const base = 'https://api.weixin.qq.com/cgi-bin'
const api = {
    accessToken: base + '/token?grant_type=client_credential'
}

export default class Wechat {
    constructor(opts){
        this.opts = Object.assign({},opts)
        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.fetchAccessToken()
    }
    async request(options) {
        
        options = Object.assign({},options,{json:true})
        const response = await request(options)
        console.log(response)
        return response
    }
    async fetchAccessToken(){
        
        let data = await this.getAccessToken()
        if(await this.isValidAccessToken(data) == false){       
            data = await this.updateAccessToken()
        }
        await this.saveAccessToken(data)
        return data
    }
    async updateAccessToken(){
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
        const data = await this.request({url:url})
        const now = new Date().getTime()
        const expiresIn = now + (data.expires_in -20)*1000
        data.expires_in = expiresIn
        return data
    }
    async isValidAccessToken(data){
        if(!data){
            return false
        }
       
        const expiresIn = data.expires_in
        const now = new Date().getTime()
        if(now < expiresIn){
            return true
        }else{
            return false
        }
    }
}