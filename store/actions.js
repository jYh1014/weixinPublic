import Services from './services'
import * as types from './mutation-types'
// import getWechatSignature from './mutations'
// console.log(getWechatSignature)
export default {
    getWechatSignature({ commit },url){
        // return new Promise((resolve, reject) => {
        //     commit(types.GETWECHAT_SIGNATURE, url)
        // })
            
        return Services.getWechatSignature(url)
    }
}