import Services from './services'
import * as types from './mutation-types'
export default {
    // getWechatSignature({commit},url){
    //     // console.log(123)
    //     return Services.getWechatSignature(url)
    // }
    [types.GETWECHAT_SIGNATURE](state,url){
        
        return Services.getWechatSignature(url)
    },
    [types.FETCH_HOUSES](state,houses){
        state.houses = houses
    },
    [types.FETCH_CHARACTERS](state, characters){
        state.characters = characters
    },
    [types.FETCH_CITIES](state, cities){
        state.cities = cities
    }
}