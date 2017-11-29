import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
// import count from './modules/count'
// import user from './modules/user'
// import createLogger from './logger'
import createLogger from 'vuex/dist/logger.js'
import _ from 'lodash'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// console.log(debug)
const createStore = () => {
    return new Vuex.Store({
      state:{
        houses:[],characters:[],cities:[],currentCharacter:[],currentHouse:[],products:[]
      },
        actions,
        mutations,
        getters,
        modules: {
          // user
        },
        strict: debug,
        plugins: debug ? [createLogger()] : []
      })
} 
export default createStore
