
import {controller, get, post,del,put} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import WikiHouse from '../database/schema/wikiHouse'
import WikiCharacter from '../database/schema/wikiCharacter'
import api from '../api'
import xss from 'xss'
import R from 'ramda'
@controller('/api')

export class ProductController {
    @get('/products')
    async getProducts(ctx,next){
        let { limit = 50 } = ctx.query
       const data = await api.product.getProducts(limit)
        
        ctx.body = {
            success: true,
            data: data
        }
    }
    @get('/products/:_id')
    async getProduct(ctx,next){
    
        let { params } = ctx 
        let { _id } = params
        if(!_id){
            return (ctx.body = {
                success: false,
                err: '_id is required'
            })
        }
        const data = await api.product.getProduct(_id)
        ctx.body = {
            success: true,
            data: data
        }
    }

    @post('/products')
    async postProducts(ctx,next){
        let product = ctx.request.body
        product = {
            title: xss(product.title),
            price: xss(product.price),
            intro: xss(product.intro),
            images:R.map(xss)(product.images),
            parameters: R.map(
               item => ({
                   key: xss(item.key),
                   value: xss(item.value)
               })
            )(product.parameters),
        }
        product = await api.product.save(product)
        ctx.body = {
            success: true,
            data: product
        }
    }
    @put('/products')
    async putProduct(ctx,next){
        let body = ctx.request.body     
        let { _id } = body
        if(!_id){
            return (ctx.body = {
                success: false,
                err: 'product not exist'
            })
        }
        product.title = xss(body.title)
        product.price = xss(body.price)
        product.intro = xss(body.intro)
        product.images = R.map(xss)(body.images)
        product.parameters = R.map(
            item => ({
                key: xss(item.key),
                value: xss(item.value)
            })
         )(body.parameters)
         try {
            product = await api.product.update(product)
            ctx.body = {
                success: true,
                data: product
            }
         } catch (e){
            ctx.body = {
                success: false,
                err: e
            }
         }
        
    }

    @del('/products/:_id')
    async delProduct(ctx,next){
        let params = ctx.params   
        let { _id } = params
        console.log(_id)
        if(!_id){
            return (ctx.body = {
                success: false,
                err: '_id is required'
            })
        }
        let product = await api.product.getProduct(_id)
        if(!product){
            return (ctx.body = {
                success: false,
                err: 'product not exist'
            })
        }
        await api.product.del(product)
        ctx.body = {
            success: true,
        }
    }
    
}
