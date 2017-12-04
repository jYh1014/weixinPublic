import Router from 'koa-router'
import sha1 from 'sha1'
import config from '../config'
import {resolve} from 'path'
import wechatMiddle from '../wechat-lib/middleware'
import reply from '../wechat/reply'
import {getWechat} from '../wechat'
import menu from '../wechat/menu'
import { signature ,redirect, oauth} from '../controllers/wechat'
let client = getWechat() 
export const router = () => {
   
    
}