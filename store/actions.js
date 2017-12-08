import Services from './services'
import * as types from './mutation-types'
import axios from 'axios'
// import getWechatSignature from './mutations'

export default {
    nuxtServerInit({ commit },{req}){
        // console.log(12)
        let user
        if(req.session && req.session.user){
            const {email,nickname,avatarUrl} = req.session.user
            user = {email,nickname,avatarUrl}
        }
        commit('SET_USER',user)
    },
    async login({ commit },{email,password}){
        let res = await axios.post('/admin/login',{email,password})
        
        let { data } = res
        if(data.success){
            commit('SET_USER',data.data)
        }
        return data
    },
    async logout({ commit }){
        await axios.post('/admin/logout')
        commit('SET_USER',null)
    },
    getWechatSignature({ commit },url){
        // return new Promise((resolve, reject) => {
        //     commit(types.GETWECHAT_SIGNATURE, url)
        // })
            
        return Services.getWechatSignature(url)
    },
    getUserByOAuth({ commit },url){
        // return new Promise((resolve, reject) => {
        //     commit(types.GETWECHAT_SIGNATURE, url)
        // })
            
        return Services.getUserByOAuth(url)
    },
    getWechatOAuth({ commit },url){
        return Services.getWechatOAuth(url)
    },
    setAuthUser({ commit }, authUser){
        commit('SET_AUTHUSER',authUser)
    },
    async fetchHouses({commit}){
        let res = await Services.fetchHouses()
        // console.log(res)
        await commit(types.FETCH_HOUSES,res.data.data)
        // state.houses = res.data.data
        return res
    },
    async fetchCharacters({commit}){
        let res = await Services.fetchCharacters()
        
       await commit(types.FETCH_CHARACTERS,res.data.data)
        // state.characters = res.data.data
        return res
    },
    // async fetchCities({commit}){
    //     let res = await Services.fetchCities()
    //    await commit(types.FETCH_CITIES,res.data.data)
    //     // state.cities = res.data.data
    //     return res
    // },
    async showHouse({commit},_id){
        
        let res = await Services.fetchHouse(_id)
        
        await commit(types.SHOW_HOUSE,res.data.data)
        return res
    },
    async showCharacter({commit},_id){
        
        let res = await Services.fetchCharacter(_id)
        // console.log(res)
        await commit(types.SHOW_CHARACTER,res.data.data)
        return res
    },
    async fetchProducts({commit}){
        
        let res = await Services.fetchProducts()
        await commit(types.FETCH_PRODUCTS,res.data.data)
        return res
    },
    async showProduct({commit},_id){

        let res = await Services.showProduct(_id)
        await commit(types.SHOW_PRODUCT,res.data.data)
        return res
    },
    async fetchUserAndOrders({commit}){
        
        let res = await Services.fetchUserAndOrders()
        // console.log(res)
        await commit(types.FETCH_USERANDORDER,res.data.data)
        return res
    },
    async saveProduct({dispatch},product){
        
        await axios.post('/api/products',product)
        let res = await dispatch('fetchProducts')
        return res.data.data
    },
    async putProduct({dispatch},product){
        
        await axios.put('/api/products',product)
        let res = await dispatch('fetchProducts')
        
        return res.data.data
    },
    async deleteProduct({dispatch},product){
       
        await axios.delete(`/api/products/${product._id}`)
        let res = await dispatch('fetchProducts')
        
        return res.data.data
    }
}