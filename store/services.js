import axios from 'axios'
const baseUrl = ''
class Services {
    getWechatSignature(url){
        console.log(axios.get(`${baseUrl}/wechat-signature?url=${url}`))
        return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
    }
    getUserByOAuth(url){
        return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)        
    }
}
export default new Services()