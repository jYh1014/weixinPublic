import request from 'request-promise'
import formsteam from 'formstream'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
const base = 'https://api.weixin.qq.com/cgi-bin'
const api = {
    accessToken: base + '/token?grant_type=client_credential',
    temporary: {
        upload: base + '/media/upload?',
        fetch: base + '/media/get?'
    },
    permanent: {
        upload: base + '/material/add_material?',
        uploadNewsPic: base + '/media/uploadimg?',
        uploadNews: base + '/material/add_news?',
        fetch: base + '/material/get_material?',
        del: base + '/material/del_material?',
        update: base + '/material/update_news?',
        count: base + '/material/get_materialcount?',
        batch: base + '/material/batchget_material?'
    }
}
async function statFile(filePath){
    return new Promise((resolve,reject) => {
        fs.stat(filePath,(err,stat) => {
            if(err){
                reject(err)
            }else{
                resolve(stat)
            }
        })
    })
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
        // console.log(response)
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
    async handle (operation, ...args) {
        const tokenData = await this.fetchAccessToken()
        
        const options = await this[operation](tokenData.access_token,...args)
        const data = await this.request(options)
        // console.log(data)
        return data
    }
    async uploadMaterial(token, type, material, permanent){
        let form = {}
        let url = api.temporary.upload 
        if(permanent){
            url = api.permanent.upload
            _.extend(form, permanent)
        }
        if(type === 'pic'){
            url = api.permanent.uploadNewsPic
        }
        if(type === 'news'){
            url = api.permanent.uploadNews
            form = material
        }else {
            form.media = fs.createReadStream(material)//以流的形式读入文件
            // form = formstream()
            // let stat = await statFile(materials)
            // form.file('media',material,path.basename(material),stat.size)
        }
        let uploadUrl = url + 'access_token=' + token
        if(!permanent){
            uploadUrl += '&type=' + type
        }else{
            if(type !== 'news'){
                form.access_token = token
            }
            
            // form.field('access_token',token)
        }
        const options = {
            method: 'POST',
            url: uploadUrl,
            json: true
        }
        if(type === 'news'){
            options.body = form
        }else{
            options.formData = form
        }
        return options
    }
}