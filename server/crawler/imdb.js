import cheerio from 'cheerio'//用于jq核心实现
import rp from 'request-promise'
import R from 'ramda'
import {resolve} from 'path'
import { writeFileSync } from 'fs'
// import Agent from 'socks5-http-client/lib/Agent'
const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export const getIMDBCharacters = async () => {
    const options = {
        uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
        // agentClass: Agent,
        // agentOptions:{
        //     socksHost: 'localhost',
        //     socksPort: 1080
        // },
        transform: body => cheerio.load(body)
    }
    let $ = await rp(options)
    let photos = []
    $('table.cast_list tr.odd, tr.even').each(function() {
        let playedBy = $(this).find('td.itemprop span.itemprop')
        playedBy = playedBy.text()
    
        let nmId = $(this).find('td.itemprop a')
        nmId = nmId.attr('href')
    
        let character = $(this).find('td.character a:first-child')

        let name = character.text()
        console.log(name)
        let chId = character.attr('href')
        photos.push({
            nmId,chId,name,playedBy
        })
    }) 
    console.log('拿到' + photos.length)
    let fn = R.compose(
        R.map((photo) => {
            const reg1 = /\/name\/(.*?)\/\?ref/
            const reg2 = /\/title\/(.*?)\?ref/
            let match1 = photo.nmId.match(reg1)
            let match2 = photo.chId.match(reg2)
            photo.nmId = match1[1]
            photo.chId = match2[1]
            return photo
        }),
        R.filter(photo => photo.playedBy && photo.name && photo.chId && photo.nmId && photo.chId !== '#' && photo.nmId !== '#')
    )
    photos = fn(photos)
    console.log('筛选后剩余' + photos.length)
    writeFileSync('./imdb.json',JSON.stringify(photos,null,2),'utf8')
}
// getIMDBChatacters()

const fetchIMDbProfile = async (url) => {
    const options = {
        uri: url,    
        transform: body => cheerio.load(body)
    }
    let $ = await rp(options)
    let img = $('.article table .image img')
    let src= img.attr('src')
    if(src){
        src = src.split('_V1').shift()
        src += '_V1.jpg'
    }
    return src
}
 
export const getIMDbProfile = async () => {
    const characters = require(resolve(__dirname,'../../wikiCharacters.json'))
    console.log(characters.length)
    for(let i = 0; i<characters.length; i++){
        if(!characters[i].profile){
            let url = `http://www.imdb.com/name/${characters[i].nmId}/`
            console.log('正在爬去' + characters[i].name)
            let src = await fetchIMDbProfile(url)
            console.log('已经爬到' + src)
            characters[i].profile = src
            writeFileSync('./imdbCharacters.json',JSON.stringify(characters,null,2),'utf8')
            await sleep(500)
        }
    }
   
}
const checkIMDbProfile = () => {
    const characters = require(resolve(__dirname,'../../imdbCharacters.json'))
    let newCharacters = []
    characters.forEach(item => {
        if(item.profile){
            newCharacters.push(item)
        }
    })
    console.log(newCharacters.length)
    writeFileSync('./validCharacters.json',JSON.stringify(newCharacters,null,2),'utf8')
}
// checkIMDbProfile()
const fetchIMDbImage = async (url) => {
    const options = {
        uri: url,    
        transform: body => cheerio.load(body)
    }
    let $ = await rp(options)
    let images = []
    let img = $('.article .media_index_thumb_list a img')
    img.each(function(){
        let src = $(this).attr('src')
        console.log(src)
        if(src){
            src = src.split('_V1').shift()
            src += '_V1.jpg'
            images.push(src)
        }
        
    })
    return images
    
}
export const getIMDbImages = async () => {
    const characters = require(resolve(__dirname,'../../validCharacters.json'))
 
    for(let i = 0; i<characters.length; i++){
        if(!characters[i].images){
            let url = `http://www.imdb.com/title/${characters[i].chId}`
            console.log('正在爬去' + characters[i].name)
            let images = await fetchIMDbImage(url)
            console.log('已经爬到' + images)
            characters[i].images = images
            writeFileSync('./fullCharacters.json',JSON.stringify(characters,null,2),'utf8')
            await sleep(500)
        }
    }
   
}
const checkIMDbImages = () => {
    const characters = require(resolve(__dirname,'../../fullCharacters.json'))
    let newCharacters = []
    characters.forEach(item => {
        if(item.profile){
            newCharacters.push(item)
        }
    })
    console.log(newCharacters.length)
    writeFileSync('./endCharacters.json',JSON.stringify(newCharacters,null,2),'utf8')
}
checkIMDbImages()