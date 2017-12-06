


import Router from 'koa-router'
import {controller, get, post} from '../decorator/router'
import { signature ,redirect, oauth} from '../controllers/wechat'
import Product from '../database/schema/product'

    export async function getProducts(limit = 50){
        
        const data = await Product.find({}).limit(Number(limit)).exec()
        
        return data
    }
 
    export async function getProduct(_id){
    
        
        let data = await Product.findOne({
            _id: _id
        }).exec()
       
        return data
    }
    export async function save(product){
        product = new Product(product)
         product = await product.save()
         return product   
    }
    export async function update(product){
        console.log(product)    
         product = await product.save()  
         
         return product   
    }
    export async function del(product){
        console.log(product)
         product = await product.remove()
         return product   
    }
    

    
    
