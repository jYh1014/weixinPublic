import Services from './services'
import * as types from './mutation-types'
// import getWechatSignature from './mutations'

export default {
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
    async fetchHouses({commit}){
        let res = await Services.fetchHouses()
        // console.log(res)
        await commit(types.FETCH_HOUSES,res.data[0].data)
        // state.houses = res.data.data
        return res
    },
    async fetchCharacters({commit}){
        let res = await Services.fetchCharacters()
       await commit(types.FETCH_CHARACTERS,res.data.data)
        // state.characters = res.data.data
        return res
    },
    async fetchCities({commit}){
        let res = await Services.fetchCities()
       await commit(types.FETCH_CITIES,res.data.data)
        // state.cities = res.data.data
        return res
    },
    async showHouse({commit},_id){
        
        let res = await Services.fetchHouse(_id)
        console.log(res)
        await commit(types.SHOW_HOUSE,res.data.data)
        return res
    }
}