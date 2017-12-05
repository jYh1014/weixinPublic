import cheerio from 'cheerio'//用于jq核心实现
import rp from 'request-promise'
import R from 'ramda'
import _ from 'lodash'
import { writeFileSync } from 'fs'

let characters = []
const sleep = time => new Promise(resolve => setTimeout(resolve, time))
export const getAPIChatacters = async (page = 1) => {
    
    const url = `https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=50`
    let body = await rp(url)//string
    body = JSON.parse(body)
    characters = _.union(characters, body)
    // console.log('现有' + characters.length + '条数据')
    if(body.length < 50){
        // console.log('爬完了')
        return
    }else {
        writeFileSync('./characters.json',JSON.stringify(characters,null,2),'utf8')
        await sleep(1000)
        page ++
        getAPIChatacters(page)
    }
     
}
getAPIChatacters()