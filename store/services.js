import axios from 'axios'
const baseUrl = ''
const apiUrl = 'http://rap.taobao.org/mockjsdata/29702'

class Services {
    getWechatSignature(url){
        // console.log(axios.get(`${baseUrl}/wechat-signature?url=${url}`))
        return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
    }
    getUserByOAuth(url){
        return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)        
    }
    fetchHouses(){
        return axios.get(`${baseUrl}/wiki/houses`)
    }
    fetchCharacters(){
        return axios.get(`${baseUrl}/wiki/characters`)
        // return {data: {data:[]},success:true}
    }
    // fetchCities(){
    //     // return axios.get(`${apiUrl}/wiki/cities`)
    //     return {data: {data:[]},success:true}
    // }
    fetchHouse(id){
        // console.log(id)
        return axios.get(`${baseUrl}/wiki/houses/${id}`)
    }
    fetchCharacter(id){
        return axios.get(`${baseUrl}/wiki/characters/${id}`)
    }
    fetchProducts(){
        return axios.get(`${baseUrl}/api/products`)
    }
    showProduct(id){
      
        return axios.get(`${baseUrl}/api/products/${id}`)
    }
    fetchUserAndOrders(){
        return axios.get(`${baseUrl}/api/user`)
    }
}
export default new Services()