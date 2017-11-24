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
    },
    tag: {
        create: base + '/tags/create?',
        fetch: base + '/tags/get?',
        update: base + '/tags/update?',
        del: base + '/tags/delete?',
        fetchUser: base + '/user/tag/get?',
        batchTag: base + '/tags/members/batchtagging?',
        batchUnTag: base + '/tags/members/batchuntagging?',
        getTagList: base + '/tags/getidlist?'
    },
    user: {
        remark: base + '/user/info/updateremark?',
        info: base + '/user/info?',
        batchInfo: base + '/user/info/batchget?',
        fetchUserList: base + '/user/get?',
        getBlackList: base + '/tags/members/getblacklist?',
        batchBlackUsers: base + '/tags/members/batchblacklis?',
        batchUnBlackUsers: base + '/tags/members/batchunblacklist?'
    },
    menu: {
        create: base + '/menu/create?',
        get: base + '/menu/get?',
        del: base + '/menu/delete?',
        addCondition: base + '/menu/addconditional?',
        delCondition: base + '/menu/delconditional?',
        getInfo: base + '/get_current_selfmenu_info?'
    },
    ticket: {
        get: base + '/ticket/getticket?'
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
        this.getTicket = opts.getTicket
        this.saveTicket = opts.saveTicket
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
        console.log(data)
        if(await this.isValidToken(data,'access_token') == false){       
            data = await this.updateAccessToken()
        }
        await this.saveAccessToken(data)
        return data
    }
    async fetchTicket(){
        
        let data = await this.getTicket()
        if(await this.isValidToken(data,'ticket') == false){       
            data = await this.updateTicket()
        }
        await this.saveTicket(data)
        return data
    }
    async updateTicket(token){
        let url = api.ticket.get + '&access_token=' + token + '&type=jsapi'
        let data = await this.request({url:url})
        let now = new Date().getTime()
        let expiresIn = now + (data.expires_in -20)*1000
        data.expires_in = expiresIn
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
    async isValidToken(data,name){
        if(!data || !data[name]){
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
        // console.log(tokenData)
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
    async fetchMaterial(token,mediaId,type,permanent){
        let form = {}
        let fetchUrl = api.temporary.fetch
        if(permanent){
            fetchUrl = api.permanent.fetch
        }
        let url = fetchUrl + 'access_token=' + token
        let options = {method: "POST",url:url}
        if(permanent){
            form.media_id = mediaId
            form.access_token = token
            options.body = form
        }else{
            if(type === 'video'){
                url = url.replace('https://','http://')
            }
            url += '&media_id=' + mediaId
        }
        return options
    }
    async deleteMaterial(token,mediaId){
        let from = {
            media_id: mediaId
        }
        let url = api.permanent.del + 'access_token=' + token
        return {method:"POST",url:url,body:form}
    }
    async updateMaterial(token,mediaId,news){
        let form = {
            media_id: mediaId
        }
        _.extend(form,news)
        let url = api.permanent.update + 'access_token=' +token
        return {method:'POST',url:url,body:form}
    }
    async countMaterial(token){
        let url = api.permanent.count + 'access_token=' +token
        return {method:'POST',url:url}
    }
    async batchMaterial(token,options){
        options.type = options.type || 'image'
        options.offset = options.offset || 0
        options.count = options.count || 20
        let url = api.permanent.batch + 'access_token=' + token
        return {method:'POST',url:url,body:form}
    }
    async createTag(token,name){
        let form = {
            tag: {name:name}
        }
        let url = api.tag.create + 'access_token=' + token
        return {method:"POST",url:url,body:form}
    }
    async fetchTags(token){
        let url = api.tag.fetch + 'access_token=' + token
        return {url:url}
    }
    async updateTag(token,tagId,name){
        let form = {
            tag:{id:tagId,name:name}
        }
        let url = api.tag.updateTag + 'access_token=' + token
        return {method:'POST',url:url,body:form}
    }
    async delTag(token,tagId){
        let form = {
            tag:{id:tagId}
        }
        let url = api.tag.del + 'access_token=' + token
        return {method:'POST',url:url,body:form}
    }
    async fetchTagUsers(token,tagId,openId){
        let from = {
            tagid:tagId,
            next_openid: openId || ''
        }
        let url = api.tag.fetchUser + 'access_token=' + token
        return {method:'POST',url:url,body:form}
    }
    async batchTag(token,openIdList,tagId,unTag){
        let form = {
            openid_list:openIdList,
            tagid:tagId
        }
        let url = api.tag.batchTag 
        if(unTag){
            url = api.tag.batchUnTag
        }
        url += 'access_token=' + token
        return {method:'POST',url:url,body:form}
    }
    async getTagList(token,openId){
        let form = {
            openid:openId
        }
        let url = api.tag.getTagList + 'access_token=' + token
        return {method:'POST',url:url,body:form}
    }
    async remarkUser(token,openId,remark){
        let form = {
            openid:openId,
            remark:remark
        }
        let url = api.user.remark + 'access_token=' + token
        return {method:'POST',url:url,body:form}
    }
    async getUserInfo(token,openId,lang){
        let url = api.user.info + 'access_token=' + token + '&openid=' + openId+  '&lang=' + (lang || 'zh_CN')
        return {url:url}
    }
    async batchUserInfo(token,userList){
        let url = api.user.batchInfo + 'access_token=' + token
        let form = {
            user_list:userList
        }
        return {method:'POST',url:url,body:form}
    }
    async fetchUserList(token,openId){
        let url = api.user.fetchUserList + 'access_token=' + token + '&next_openid=' + (openId || '')
        return {url:url}
    }
    async createMenu(token,menu){
        let url = api.menu.create + 'access_token=' + token
        return {method:'POST',url:url,body:menu}
    }
    async getMenu(token){
        let url = api.menu.get + 'access_token=' + token   
        return {url:url}     
    }
    async delMenu(token){
        let url = api.menu.del + 'access_token=' + token   
        return {url:url}     
    }
    async addCondition(token,menu,rule){
        let url = api.menu.addCondition + 'access_token=' + token   
        let form = {
            button: menu,
            matchrule: rule
        }
        return {method:'POST',url:url,body:form}     
    }
   async delCondition(token,menuId){
        let url = api.menu.delCondition + 'access_token=' + token 
        let from = {
            menuid: menuId
        }   
        return {method:'POST',url:url,body:form}   
    }
    async getCurrentMenuInfo(token){
        let url = api.menu.getInfo + 'access_token=' + token 
        return {url:url}
    }
}