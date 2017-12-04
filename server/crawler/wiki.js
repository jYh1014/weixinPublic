import rp from 'request-promise'
import R from 'ramda'
import {resolve} from 'path'
import _ from 'lodash'
import { writeFileSync } from 'fs'
import { fetchImage } from '../libs/qiniu'
import randomToken from 'random-token'
const normalizedContent = content => _.reduce(content, (acc, item)=> 
{
   if(item.text) acc.push(item.text)
   if(item.elements && item.elements.length){
       let _acc = normalizedContent(item.elements)     
       acc = R.concat(acc, _acc)
       
   }
   
   return acc
},[])

const normalizedSections = R.compose(
    R.nth(1),
    R.splitAt(1),
    R.map(i => ({
        level: i.level,
        title: i.title,
        content: normalizedContent(i.content)
    }))
)
const getWikiId = async data => {
    let query = data.name || data.cname
    let url = `http://zh.asoiaf.wikia.com/api/v1/Search/List?query=${encodeURI(query)}`
    let res
    try {
        res = await rp(url)
    } catch (error) {
        console.log(error)
    }
    res = JSON.parse(res)
    res = res.items[0]
    return R.merge(data,res)
}

const getWikiDetail = async data => {
    let { id } = data
    let query = data.name || data.cname
    let url = `http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=${id}`
    let res
    try {
        res = await rp(url)
    } catch (error) {
        console.log(error)
    }
    
    // console.log(typeof res)
    res = JSON.parse(res)
    // console.log(res)
    let getCnameAndIntro = R.compose(
        i => ({
            cname: i.title,
            intro: R.map(R.prop(['text']))(i.content)
        }),
        R.pick(['title','content']),
        R.nth(0),
        R.filter(R.propEq('level',1)),
        R.prop('sections')
    )
    let getLevel = R.compose(
        R.project(['title','content','level']),
        R.reject(R.propEq('title','扩展阅读')),
        R.reject(R.propEq('title','引用与注释')),
        R.filter(i => i.content.length),
        R.prop('sections')
    )
    let cnameIntro = getCnameAndIntro(res)
    // console.log(cnameIntro)
    let sections = getLevel(res)
    // console.log(sections)
    let body = R.merge(data, getCnameAndIntro(res))
    
    sections = normalizedSections(sections)
    // console.log(sections)
    body.sections = sections
    body.wikiId = id
    return R.pick(['name','cname','playedBy','profile','images','chId','nmId','sections','intro','wikiId','words'],body)
}

export const getWikiCharacters = async () => {
    let data = require(resolve(__dirname,'../../endCharacters.json'))
    // data = [data[0]]
    data = R.map(getWikiId, data)  
    data = await Promise.all(data)
    data = R.map(getWikiDetail,data) 
    data = await Promise.all(data)
    writeFileSync('./finalCharacters.json',JSON.stringify(data,null,2),'utf8')
}
// getWikiCharacters()

export const fetchImageFromIMDb = async () => {
    let IMDbCharacters = require(resolve(__dirname,'../../finalCharacters.json'))
    IMDbCharacters = [IMDbCharacters[0]]
    IMDbCharacters = R.map(async item => {
        let key = `${item.nmId}/${randomToken(32)}`
        await fetchImage(item.profile, key)
        item.profile = key
        for(let i = 0; i< item.images.length;i++){
            let _key = `${item.nmId}/${randomToken(32)}`
            await fetchImage(item.images[i],_key)
            item.images[i] = _key
        }
        return item
    })(IMDbCharacters)
    IMDbCharacters = await Promise.all(IMDbCharacters)
    writeFileSync('./completeCharacters.json',JSON.stringify(IMDbCharacters,null,2),'utf8')
    
}
fetchImageFromIMDb()