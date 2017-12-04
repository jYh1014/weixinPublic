import Router from 'koa-router'
import glob from 'glob'
import { resolve } from 'path'
import _ from 'lodash'
export let routersMap = new Map()
// console.log(routersMap)
export const symbolPrefix = Symbol('prefix')
export const isArray = v => _.isArray(v)?v:[v]
export const normalizePath = path => path.startsWith('/')?path:`/${path}`
export default class Route {
    constructor(app, apiPath){
        this.app = app
        this.apiPath = apiPath
        this.router = new Router()
    }
    init(){
        glob.sync(resolve(this.apiPath, './*.js')).forEach(require)
        // console.log(routersMap)
        for(let [conf, controller] of routersMap){
           
            const controllers = isArray(controller)
            // console.log(controllers)
            let prefixPath = conf.target[symbolPrefix]
            if(prefixPath) prefixPath = normalizePath(prefixPath)
            const routerPath = prefixPath + conf.path
            console.log(routerPath)
            this.router[conf.method](routerPath, ...controllers)
            this.app.use(this.router.routes())
            this.app.use(this.router.allowedMethods())
        }
        // console.log(routersMap)
    }
}

export const router = conf => (target, key, desc) => {
    conf.path = normalizePath(conf.path)
    routersMap.set({
        target: target,...conf
    },target[key])
}
export const controller = path => {
    // console.log(path)
   return target =>{target.prototype[symbolPrefix] = path;console.log(target.prototype)}
}
//  console.log(controller)
export const get = path => router({
    method: 'get',path: path
})
export const post = path => router({
    method: 'post',path: path
})
export const put = path => router({
    method: 'put',path: path
})
export const del = path => router({
    method: 'del',path: path
})